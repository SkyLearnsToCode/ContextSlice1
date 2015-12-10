import xml.etree.ElementTree as ET
import json

inp = "sample_data_input/crescent.xml"

tree = ET.parse('sample_data_input/crescent.xml')
root = tree.getroot()

documents = {"documents":[]}

for doc in root.iter('document'):
	print doc[0].tag



#with io.open('graph.json', 'w', encoding='utf-8') as f:
 # f.write(unicode(json.dumps(documents, indent=4, separators=(',', ': '), ensure_ascii=False)))
