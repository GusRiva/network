import requests
from lxml import html
from bs4 import BeautifulSoup
import pandas as pd
import json
import codecs


#In this variable I will store the information as a dictionary with this structure:
# {number : "Name"}
final_dict = {}

for index in range(2010,2015):
	print(index)
	page = requests.get('http://www.handschriftencensus.de/'+ str(index))
	c = page.content
	soup = BeautifulSoup(c, "lxml")

	ms = soup.find_all("th", class_="ort")
	if len(ms) > 0:
		final_dict[index] = ms[0].text.rstrip()



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
    json.dump(final_dict,outfile, indent=2)

#To save the data as a csv
# table = pd.DataFrame.from_dict(final_dict, orient='index')
# table.to_csv("Handschriftencensus_full.csv", encoding="utf-8")
