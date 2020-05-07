

cases <- read_csv('https://raw.githubusercontent.com/epiforecasts/covid-global/master/national-summary/cases.csv')

rt <- read_csv('https://raw.githubusercontent.com/epiforecasts/covid-global/master/national-summary/rt.csv')

cases %>% pull(date) %>% min
rt %>% pull(date) %>% min

cases %>% pull(date) %>% max
rt %>% pull(date) %>% max


pd <- cases %>% left_join(rt, by = c('country', 'date')) %>% 
  drop_na() %>% 
  mutate(cases_90 = upper_90.x - lower_90.x,
         cases_50 = upper_50.x - lower_50.x,
         rt_90 = upper_90.y - lower_90.y,
         rt_50 = upper_50.y - lower_50.y) %>% 
  dplyr::select(country, date, median.x, median.y, cases_90, cases_50, rt_90, rt_50) %>% 
  rename(cases_median = median.x, 
         rt_median = median.y)

write_csv(pd, '/Users/hamishgibbs/Documents/Covid-19/RT_estimation/interactive_viz/rt_interactive_vis/cases_r0_comparison/data/m_compare_data.csv')


dates <- pd %>% pull(date) %>% unique()

pd %>%
  filter(country == 'United States of America') %>% 
  ggplot() +
  geom_path(aes(x = median.y, y = log(median.x), group = country, colour = country)) +
#  ylim(0, 2.5) +
  theme_bw() +
  theme(legend.position = 'none')
