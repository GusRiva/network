import codecs
import json

with codecs.open('handschriftencensus_data.json', 'r', 'utf-8') as json_file:
    data = json.load(json_file)

result_json = {'nodes': [], 'links' : []}

all_manuscripts = set()
for item in data:
    if 'manuscripts' in data[item]:
        manuscripts = data[item]['manuscripts']
        for ms in manuscripts:
            all_manuscripts.add(ms)

for index, manuscript in enumerate(all_manuscripts):
    result_json['nodes'].append({'id': 'h'+ str(index), 'name': manuscript})

for item in data:
    work_id = item
    title = data[item]['title']

    result_json['nodes'].append({'id': 'w' + str(work_id), 'name': title})
    if 'manuscripts' in data[item]:
        manuscripts = data[item]['manuscripts']
        for ms in manuscripts:
            # Confused

    result_json['links'].append({'source': 'w'+ str(work_id), 'target': 2})

with codecs.open('hsc_d3_data.json', 'w', 'utf-8') as outfile:
    json.dump(result_json,outfile)

