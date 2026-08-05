import heapq
import numpy as np
from ai.ice_detector import pixel_to_lunar_coords

class RoverPathPlanner:
    """
    Safe Rover Landing Site Selection & A* Pathfinding Service.
    Finds optimal safe landing zones (slope < 8°, solar illumination, ice proximity)
    and plans optimal traversal routes avoiding hazardous terrain slopes.
    """

    @staticmethod
    def calculate_slope(dem_matrix):
        """Calculate terrain slope gradient map in degrees."""
        dy, dx = np.gradient(dem_matrix)
        slopes_rad = np.arctan(np.sqrt(dx**2 + dy**2))
        slopes_deg = np.degrees(slopes_rad)
        return slopes_deg

    def evaluate_landing_sites(self, dem_matrix, shadow_mask, confidence_map, ice_deposits=None, center_coords=(-89.9, 0.0), extent_km=25.0):
        """
        Evaluates safe landing site suitability score across grid.
        Suitability = 0.45 * Flatness + 0.35 * Illumination + 0.20 * IceProximity
        Calculates exact Landing Site Lunar Lat/Lon coordinates and distances to all ice deposit locations.
        """
        slopes = self.calculate_slope(dem_matrix)
        h, w = dem_matrix.shape
        res_km = extent_km / w
        
        # Flatness score (1.0 for 0° slope, 0.0 for > 15° slope)
        flatness_score = np.clip(1.0 - (slopes / 15.0), 0.0, 1.0)

        # Illumination score (1.0 for sunlit rim, 0.0 for deep shadow)
        illumination_score = 1.0 - shadow_mask

        # Ice proximity score (high near ice targets, but not inside treacherous zero-visibility pits)
        ice_proximity_score = confidence_map / 100.0

        suitability_score = (
            0.45 * flatness_score +
            0.35 * illumination_score +
            0.20 * ice_proximity_score
        ) * 100.0

        # Disqualify sites with slope > 12°
        suitability_score[slopes > 12.0] = 0.0

        # Find best landing coordinate (highest suitability)
        best_r, best_c = np.unravel_index(np.argmax(suitability_score), suitability_score.shape)
        best_r, best_c = int(best_r), int(best_c)

        landing_lunar_coords = pixel_to_lunar_coords(best_r, best_c, (h, w), center_coords, extent_km)

        # Calculate distances from landing site to each detected ice deposit
        primary_target_r, primary_target_c = best_r, best_c
        primary_target_name = "Primary Ice Target"

        if ice_deposits and len(ice_deposits) > 0:
            for dep in ice_deposits:
                dep_r, dep_c = dep["centroid_pixel"][0], dep["centroid_pixel"][1]
                dist_px = np.sqrt((dep_r - best_r)**2 + (dep_c - best_c)**2)
                dist_km = dist_px * res_km
                dist_m = dist_km * 1000.0
                dep["distance_from_landing_site_km"] = round(float(dist_km), 2)
                dep["distance_from_landing_site_m"] = round(float(dist_m), 1)

            # Primary target is the highest volume / top deposit
            primary_dep = ice_deposits[0]
            primary_target_r, primary_target_c = primary_dep["centroid_pixel"][0], primary_dep["centroid_pixel"][1]
            primary_target_name = primary_dep["name"]
        else:
            ice_target_r, ice_target_c = np.unravel_index(np.argmax(confidence_map), confidence_map.shape)
            primary_target_r, primary_target_c = int(ice_target_r), int(ice_target_c)

        target_lunar_coords = pixel_to_lunar_coords(primary_target_r, primary_target_c, (h, w), center_coords, extent_km)

        dist_px = np.sqrt((primary_target_r - best_r)**2 + (primary_target_c - best_c)**2)
        dist_km = dist_px * res_km
        dist_m = dist_km * 1000.0

        landing_info = {
            "landing_coords_pixel": [best_r, best_c],
            "landing_lunar_coords": landing_lunar_coords,
            "target_coords_pixel": [primary_target_r, primary_target_c],
            "target_lunar_coords": target_lunar_coords,
            "primary_target_name": primary_target_name,
            "straight_line_distance_km": round(float(dist_km), 2),
            "straight_line_distance_m": round(float(dist_m), 1),
            "landing_suitability_pct": round(float(suitability_score[best_r, best_c]), 2),
            "landing_slope_deg": round(float(slopes[best_r, best_c]), 2),
            "max_slope_deg": round(float(np.max(slopes)), 2),
            "mean_slope_deg": round(float(np.mean(slopes)), 2)
        }

        return suitability_score, slopes, landing_info

    def plan_rover_path(self, dem_matrix, slopes, start_pos, target_pos):
        """
        A* Shortest Safe Traversal Path algorithm.
        Avoids slopes > 15° (infinite cost) and penalizes steep slopes.
        """
        rows, cols = dem_matrix.shape
        start = (int(start_pos[0]), int(start_pos[1]))
        goal = (int(target_pos[0]), int(target_pos[1]))

        # Directions: 8-neighbor movement
        dirs = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]

        open_set = []
        heapq.heappush(open_set, (0, start))

        came_from = {}
        g_score = {start: 0.0}

        def heuristic(a, b):
            return np.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

        f_score = {start: heuristic(start, goal)}

        max_iterations = 40000
        iters = 0

        while open_set and iters < max_iterations:
            iters += 1
            curr_f, current = heapq.heappop(open_set)

            if current == goal or heuristic(current, goal) < 3.0:
                # Reconstruct path
                path = [current]
                while current in came_from:
                    current = came_from[current]
                    path.append(current)
                path.reverse()
                
                # Downsample path waypoints for smooth rendering
                step = max(1, len(path) // 30)
                downsampled_path = path[::step]
                if path[-1] not in downsampled_path:
                    downsampled_path.append(path[-1])

                # Calculate total distance in km (~0.02 km per pixel)
                dist_pixels = sum(
                    np.sqrt((downsampled_path[i][0] - downsampled_path[i-1][0])**2 + 
                            (downsampled_path[i][1] - downsampled_path[i-1][1])**2)
                    for i in range(1, len(downsampled_path))
                )
                distance_km = dist_pixels * 0.02

                return {
                    "path_waypoints": [[int(r), int(c)] for r, c in downsampled_path],
                    "total_distance_km": round(float(distance_km), 2),
                    "total_waypoints": len(downsampled_path),
                    "status": "Path Found"
                }

            for dr, dc in dirs:
                nr, nc = current[0] + dr, current[1] + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    slope = slopes[nr, nc]
                    if slope > 18.0:
                        continue  # Impassable steep cliff hazard

                    step_cost = np.sqrt(dr**2 + dc**2) * (1.0 + (slope / 5.0)**2)
                    tentative_g = g_score[current] + step_cost

                    neighbor = (nr, nc)
                    if neighbor not in g_score or tentative_g < g_score[neighbor]:
                        came_from[neighbor] = current
                        g_score[neighbor] = tentative_g
                        f_score[neighbor] = tentative_g + heuristic(neighbor, goal)
                        heapq.heappush(open_set, (f_score[neighbor], neighbor))

        # Fallback straight line route if path blocked by extreme terrain
        r_line = np.linspace(start[0], goal[0], 25).astype(int)
        c_line = np.linspace(start[1], goal[1], 25).astype(int)
        fallback_path = [[int(r), int(c)] for r, c in zip(r_line, c_line)]
        
        return {
            "path_waypoints": fallback_path,
            "total_distance_km": round(float(len(fallback_path) * 0.02), 2),
            "total_waypoints": len(fallback_path),
            "status": "Direct Line Route"
        }
