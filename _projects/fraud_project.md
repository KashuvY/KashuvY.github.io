---
layout: page
title: Federated Fraud Detection
description: Privacy preserving fraud detection using TGNNs in a HFL environment
img: assets/img/fraud.png
importance: 1
category: work
---
Credit card fraud is a persistent challenge for financial institutions, requiring sophisticated detection methods capable of analyzing large volumes of transactional data in real-time. Traditional machine learning models often struggle to capture the complex temporal and relational patterns present in transaction networks. Temporal Graph Neural Networks (TGNNs) have emerged as powerful tools for modeling such data, effectively integrating temporal dynamics with the structural relationships between entities.

However, deploying TGNNs on sensitive financial data raises significant privacy concerns. Horizontal Federated Learning (HFL) offers a solution by enabling multiple institutions to collaboratively train a shared model without exchanging raw data. In this post, we delve into the mathematical foundations of integrating TGNNs within an HFL framework to enhance credit card fraud detection while preserving data privacy.

## Temporal Graph Neural Networks (TGNNs)

### Modeling Transaction Networks
Credit card transactions can be naturally represented as a temporal graph. Formally, let $$G = (V, E, T)$$ denote a temporal graph where:
- $$V$$ is the set of nodes representing credit card accounts.
- $$E \subset V \times V $$ is the set of edges representing transactions between accounts.
- $$T$$ is the set of timestamps associated with each edge.
Each edge $$e=(u,v,t)$$ carries features $$x_e$$ (e.g., transaction amount, merchant category) and may have an associated label $$y_e$$ indicating whether the transaction is fraudulent.

### TGNN Architecture
TGNNs extend traditional Graph Neural Networks by incorporating temporal information into the message-passing framework. The node embeddings $$h_v^t$$ evolve over time based on interactions with neighboring nodes.
