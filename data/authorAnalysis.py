import codecs
import networkx as nx
from networkx.algorithms import bipartite as bp
import json
import statistics

with codecs.open('hsc_d3_data_final_verfasser.json', 'r', 'utf-8') as json_file:
    dataSource = json.load(json_file)

def countAnonym(data):
    nodes = data['nodes']
    anonymeCount = 0
    authorCount = 0

    for node in nodes:
        if node['group'] == "w":
            if node['author'] == 'anonym':
                anonymeCount += 1
            else:
                authorCount += 1

    print(anonymeCount, authorCount)

def degreeAnonym(data):
    w_nodes = [n for n in data['nodes'] if n['group'] == 'w']
    top_nodes = {n['id'] for n in w_nodes}
    anonym_nodes = [n['id'] for n in w_nodes if n['author'] == 'anonym']
    author_nodes =  [n['id'] for n in w_nodes if n['author'] != 'anonym']
    G = nx.json_graph.node_link_graph(data, directed=False, multigraph=False)
    UniG = bp.weighted_projected_graph(G, top_nodes)
    anonym_degrees = [n[1] for n in UniG.degree( anonym_nodes , weight = 'weight')]
    author_degrees = [n[1] for n in UniG.degree( author_nodes , weight = 'weight')]

    avg_degree_anonym = sum( anonym_degrees ) / len(anonym_degrees)
    avg_degree_author = sum( author_degrees ) / len(author_degrees)

    median_degree_anonym = statistics.median(anonym_degrees)
    median_degree_author = statistics.median(author_degrees)

    stdev_degree_anonym = statistics.stdev(anonym_degrees)
    stdev_degree_author = statistics.stdev(author_degrees)

    variance_degree_anonym = statistics.variance(anonym_degrees)
    variance_degree_author = statistics.variance(author_degrees)

    print('anonym: ', variance_degree_anonym)
    print('author: ', variance_degree_author)
    # print('anonym: ', UniG.degree( anonym_nodes , weight = 'weight'))
    # print('author: ', UniG.degree(author_nodes, weight='weight'))


degreeAnonym(dataSource)
