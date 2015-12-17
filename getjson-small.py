import xml.etree.ElementTree as ET
from math import sqrt
import json
import numpy as np
#import pandas as pd
#from pandas import Series, DataFrame
import os
import io
os.chdir('.')
os.getcwd()

#combine aliases to a uniform name
def filter(item, tag, aliases):
	for alias in aliases:
		if tag in alias and item in alias:
			##print item, "--", alias[1]
			return alias[1]
	return item

#find co-occurance of items
def cooccur(item1, item2):
	cooccurence = 0
	for doc in root.iter('document'):
		childtexts = []
		for child in doc:
			item = child.text
			if item != None and child.tag != 'docID' and child.tag != 'docText':
				childtexts.append(item)
		if item1 in childtexts and item2 in childtexts:
			#print item1, "& ", item2, " cooccur in ", doc[0].text
			cooccurence += 1
	return cooccurence

#build item-item matrix
# def item_item():
# 	item_item = []
# 	for pri_item in items:
# 		cooccurence = 0
# 		row = []
# 		#print pri_item
# 		for itr_item in items:
# 			#print itr_item
# 			cooccurence = cooccur(pri_item, itr_item)
# 			row.append(cooccurence)
# 			#print cooccurence
# 		item_item.append(row)
# 	return item_item

tree = ET.parse('sample_data_input/doc1-3.xml')
root = tree.getroot()

#build aliases dictionary
aliasedType = []
aliases = []
for name in root.iter('alias'):
	pid = []
	oid = []

	alias = [name[0][0].tag,name[0][0].text]

	#check if primary id and other id are of the same type
	for n in name:
		if "primary" in n.tag:
			pid.append(n)
		if "other" in n.tag:
			oid.append(n)
			alias.append(n[0].text)
	##print "pid is ", pid, "oid is ", oid
	aliases.append(alias)

	for o in oid:
		for p in pid:
			if (o == p):
				print "xml file error: id of different type ===> index: ", oid.index(o)
				break
			#extract the types that have aliases
			elif p[0].tag not in aliasedType:
				##print p[0].tag
				aliasedType.append(name[0][0].tag);

##print aliasedType, aliases

#doc_item = doc_item()

#find items
items = []
nodes = []
contents = []
for doc in root.iter('document'):
	docid = doc[0].text
	index = doc[3].text.index(":")
	contents.append({"docid": docid, "docheader": doc[3].text[:index], "doctext": doc[3].text[index+1:]});
	for child in doc:
		item = child.text
		tag = child.tag
		if item not in items and item != None and child.tag != 'docID' and child.tag != 'docText':
			if child.tag in aliasedType:
				#deal with duplication
				item = filter(item, child.tag, aliases)
			items.append(item)
			node = {'name':item,'category':tag,'docid':docid}
			nodes.append(node)
items.sort()
item_item = []

graph = {"nodes":[],"links":[],"contents":[]}
#for idx, node_name in enumerate(items):
#    graph["nodes"].append({"group":idx,"name":node_name})
graph["nodes"] = nodes;
graph["contents"] = contents;
link_count = 0

for idx1, item1 in enumerate(items):
    cooccurence = 0
    row = []
    for idx2, item2 in enumerate(items):
        cooccurence = cooccur(item1, item2)
        
        if cooccurence is not 0:
            graph["links"].append({"source":idx1,"target":idx2,"value":cooccurence})
            link_count+=1
            



# for idx1, item1 in enumerate(items):
#     cooccurence = 0
#     row = []
#     print "this happened"
#     for idx2, item2 in enumerate(items):
#         cooccurence = cooccur(item1, item2)
#         row.append(cooccurence)
#         item_item.append(row)
# print item_item
#
# df = DataFrame(item_item, columns = items, index=items)
# df.to_csv("item_item_dataframe.csv")

#node_links = {"nodes":[{"name":"Myriel","group":1}], "links":[{"source":1,"target":0,"value":1}]}




with io.open('graph_small.json', 'w', encoding='utf-8') as f:
  f.write(unicode(json.dumps(graph, indent=4, separators=(',', ': '), ensure_ascii=False)))
