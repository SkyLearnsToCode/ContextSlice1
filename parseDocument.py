import xml.etree.ElementTree as ET
import json

inp = "sample_data_input/crescent.xml"

tree = ET.parse('sample_data_input/crescent.xml')
root = tree.getroot()

documents = {"documents":[]}
document = "{\n\"";

for doc in root.iter('document'):
	for elem in doc:
		document[elem.tag] = elem.text
	document += "},\n{\n\"";






#with io.open('graph.json', 'w', encoding='utf-8') as f:
 # f.write(unicode(json.dumps(documents, indent=4, separators=(',', ': '), ensure_ascii=False)))
