library('rjson')
library('rlist')
setwd('C:/xampp/htdocs/d3network/data/')
input <- fromJSON(file = "hsc_d3_data_final.json")

works <- list('w507', 'w485', 'w710', 'w541', 'w93', 'w1016', 'w483', 'w484')

for (w in works)
{
  lk = list.search(input['links'], . == w )
  
}
