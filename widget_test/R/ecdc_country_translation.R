d <- read_csv('https://raw.githubusercontent.com/epiforecasts/covid-global/0a83efba34a9e5e5e4bf5cbb810ec749fed1a134/national-summary/rt.csv')

countries = d %>% pull(country) %>% unique()
d %>% 
  filter(country == "China") %>% 
  ggplot() + 
  geom_path(aes(x = date, y = upper_90, group = country)) +
  geom_path(aes(x = date, y = lower_90, group = country)) +
  geom_path(aes(x = date, y = upper_50, group = country), colour = 'red') +
  geom_path(aes(x = date, y = lower_50, group = country), colour = 'red')
  

ne_countries <- tibble(ne_country = countries) %>% 
  mutate(iso = countrycode::countrycode(ne_country, origin = 'country.name', destination = 'iso3c'),
         iso = ifelse(ne_country == 'Kosovo', 'RKS', iso))

ecdc_countries <- tibble(ecdc_country = NCoVUtils::get_ecdc_cases() %>% pull(country) %>% unique()) %>% 
  mutate(ecdc_country = gsub('_', ' ', ecdc_country),
         iso = countrycode::countrycode(ecdc_country, origin = 'country.name', destination = 'iso3c'),
         iso = ifelse(ecdc_country == 'Kosovo', 'RKS', iso),
         ecdc_country = NCoVUtils::get_ecdc_cases() %>% pull(country) %>% unique())


translation <- ne_countries %>% left_join(ecdc_countries)



setdiff(ecdc_country, countries)
setdiff(countries, ecdc_country)
