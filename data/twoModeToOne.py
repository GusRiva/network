import codecs
import networkx as nx
import json
from networkx.readwrite import json_graph
from networkx.algorithms import bipartite as bp
from scipy import sparse

from matplotlib import pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage
import numpy as np

from sklearn.cluster import AgglomerativeClustering

with codecs.open('hsc_d3_data_final.json', 'r', 'utf-8') as json_file:
    data = json.load(json_file)
nodes = data['nodes']
top_nodes = {n['id'] for n in data['nodes'] if n['group'] == 'w'}

G = json_graph.node_link_graph(data, directed=False, multigraph=False)

UniG = bp.weighted_projected_graph(G, top_nodes)

weighted_degrees = UniG.degree(weight = "weight")

# Create a list of combinations of length 2, and make the calculation

