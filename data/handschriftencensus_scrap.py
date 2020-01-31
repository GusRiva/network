import requests
from lxml import html
from bs4 import BeautifulSoup
import json
import codecs
import re


#In this variable I will store the information as a dictionary with this structure:
# {number : "Name"}
ms_dict = {}

links_dict = {"links" : []}

for index in range(1,27000):
	print(index)
	page = requests.get('http://www.handschriftencensus.de/'+ str(index))
	c = page.content
	soup = BeautifulSoup(c, "lxml")

	ms_label = soup.find_all("th", class_="ort")
	if len(ms_label) > 0:
		ms_label = ms_label[0].text.rstrip()
		ms_dict[ "h" + str(index)] = ms_label

		inhalt = soup.find_all("a", class_="aw")
		for el in inhalt:
			work_id = re.findall('/\d+$', el['href'])[0][1:]
			links_dict['links'].append( { "source": "h" + str(index), "target": "w" + work_id } )



		# In td id="inhalt" get the href, and only the number. Create the links at the same time

		# work = work[0].text
		# work = work.replace("'","")
		# final_dict[index +1] = {"title":work}
		#
		# signaturen = soup.find_all("ol", class_="signaturen")
		# if len(signaturen) > 0:
		# 	final_dict[index+1]["manuscripts"] = []
		# 	signaturen = signaturen[0]
		# 	for elem in signaturen:
		# 		if len(elem) > 1:
		# 			manuscript = elem.find_all("a")[0]
		#
		# 			final_dict[index+1]["manuscripts"].append(manuscript.text)
	index = index + 1
	


#Save data as json
with codecs.open('manuscripts_ids.json', 'w', 'utf-8') as outfile:
    json.dump(ms_dict,outfile, indent=2)

with codecs.open('links.json', 'w', 'utf-8') as outfile:
    json.dump(links_dict,outfile, indent=2)

#To save the data as a csv
# table = pd.DataFrame.from_dict(final_dict, orient='index')
# table.to_csv("Handschriftencensus_full.csv", encoding="utf-8")
