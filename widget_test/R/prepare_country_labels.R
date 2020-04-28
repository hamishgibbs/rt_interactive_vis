#change to ouput a summarty file of country names and their "expected labels"

rds_files <- list.files('/Users/hamishgibbs/Documents/Covid-19/RT_estimation/interactive_viz/covid-global/national-summary', pattern = '/*.rds', full.names = T)

rds_files

d <- read_rds(rds_files[2])

d <- d %>% 
  mutate(iso3c = countrycode::countrycode(sourcevar = region, origin = 'country.name', destination = 'iso3c'))

d %>% filter(is.na(iso3c)) %>% pull(iso3c) %>% length()

testthat::test_that('No iso codes are missing', {
  
  n_iso_missing <- d %>% filter(is.na(iso3c)) %>% pull(iso3c) %>% length()

  expect_equal(n_iso_missing, 0)
  
})

