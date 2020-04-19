
rds_files <- list.files('/Users/hamishgibbs/Documents/Covid-19/RT_estimation/interactive_viz/covid-global/national/United States of America/latest', 
                        pattern = '.rds', 
                        full.names = TRUE)

d <- read_rds(rds_files[20])

cases <- NCoVUtils::get_ecdc_cases("United_States_of_America")

d <- read_rds('/Users/hamishgibbs/Documents/Covid-19/RT_estimation/interactive_viz/covid-global/national/United States of America/latest/summarised_nowcast.rds')

d <- d %>% 
  filter(type == 'nowcast') %>% 
  left_join(cases, by = c('date' = 'date')) %>% 
  mutate(cases = ifelse(is.na(cases), 0, cases)) %>% 
  select(-day, -month, -year, -deaths, -country, -geoid, -countryterritoryCode, -population_2018)

d %>% 
  ggplot() +
  geom_path(aes(x = date, y = median)) +
  geom_path(aes(x = date, y = cases))

write_csv(d, '/Users/hamishgibbs/Documents/Covid-19/RT_estimation/interactive_viz/rt_interactive_vis_datasets/nowcast_test_usa.csv')
