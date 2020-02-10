import codecs
import json

with codecs.open('hsc_d3_data_final.json', 'r', 'utf-8') as json_file:
    data = json.load(json_file)

result_json = {'nodes': [], 'links':[]}

for work in data['nodes']:
    group = work['group']
    if group == 'w':
        if ":" in work['label']:
            author:
    else:
        result_json['nodes'].append(work)


for link in data['links']:
    result_json['links'].append(link)


with codecs.open('hsc_d3_data_final_verfasser.json', 'w', 'utf-8') as outfile:
    json.dump(result_json,outfile, indent=2)



