c <- ne_countries(returnclass = 'sf')

cont <- read_csv('https://pkgstore.datahub.io/JohnSnowLabs/country-and-continent-codes-list/country-and-continent-codes-list-csv_csv/data/b7876b7f496677669644f3d1069d3121/country-and-continent-codes-list-csv_csv.csv')

c
cont
c_ref <- c %>% 
  left_join(cont, by = c('iso_a3' = 'Three_Letter_Country_Code')) %>% 
  st_set_geometry(NULL) %>% 
  dplyr::select(sovereignt,  iso_a3, Continent_Name) %>% 
  as_tibble() %>% 
  rename(continent = Continent_Name) %>% 
  mutate(continent = ifelse(continent == 'North America', 'Americas', continent),
         continent = ifelse(continent == 'South America', 'Americas', continent)) %>% 
   filter(continent != 'Antarctica')

rt <- read_csv('https://raw.githubusercontent.com/hamishgibbs/rt_interactive_vis/master/rt.csv')


rt_c <- rt %>% 
  mutate(iso = countrycode(country, 'country.name', 'iso3c')) %>% 
  left_join(c_ref, by = c('iso' = 'iso_a3')) %>% 
  dplyr::select(-sovereignt) %>% 
  mutate(continent = ifelse(country %in% c('Bahrain', 'Singapore'), 'Asia', continent))

write_csv(rt_c, '../../rt_cont.csv')
