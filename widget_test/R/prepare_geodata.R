
rt_data <- read_csv('/Users/hamishgibbs/Documents/Covid-19/RT_estimation/interactive_viz/test_visualization/rt.csv')

estim_countries = rt_data %>% pull(country) %>% unique()

world <- rnaturalearth::ne_countries(returnclass = 'sf', scale = 'medium') %>% 
  as_tibble() %>% 
  st_as_sf()

world <- world %>% 
  mutate(c_traj = runif(length(world$labelrank), 0, 1),
         c_traj = ntile(c_traj, 5),
         c_traj = ifelse(c_traj == 1, 'decreasing', c_traj),
         c_traj = ifelse(c_traj == 2, 'likely_decreasing', c_traj),
         c_traj = ifelse(c_traj == 3, 'unsure', c_traj),
         c_traj = ifelse(c_traj == 4, 'likely_increasing', c_traj),
         c_traj = ifelse(c_traj == 5, 'increasing', c_traj),
         c_traj = ifelse(!sovereignt %in% estim_countries, 'no_data', c_traj),
         iso_a3 = ifelse(iso_a3 == -99, NA, iso_a3)) %>% 
  select(sovereignt, iso_a3, c_traj) %>% 
  filter(sovereignt != 'Antarctica')


st_write(world, './geo_data/world.geojson')

world %>% ggplot() + geom_sf()

min(rt_data$date)

max(rt_data$date)

