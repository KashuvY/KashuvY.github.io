---
layout: page
title: Federated Fraud Detection
description: Privacy preserving fraud detection using TGNNs in a HFL environment
img: assets/img/fraud.png
importance: 2
category: work
---
Credit card fraud is a persistent challenge for financial institutions, requiring sophisticated detection methods capable of analyzing large volumes of transactional data in real-time.
In fact, an estimated 52 million Americans had fraudulent charges on their credit or debit cards in 2023, totaling over $5 billion in unauthorized purchases [[1](https://www.security.org/digital-safety/credit-card-fraud-report/)].

Predicting and preventing credit card fraud is challenging because:
1. Banks are typically prohibited from sharing their transaction statistics due to data security and privacy regulations.
2. Credit card transaction datasets are extremely biased, with far fewer examples of fraudulent purchases compared to legitimate ones.
3. Smaller financial institutions, especially in developing countries, often struggle with limited access to extensive transaction data.

Traditional machine learning models often struggle to capture the complex temporal and relational patterns present in transaction networks.
Temporal Graph Neural Networks (TGNNs) have emerged as powerful tools for modeling such data, effectively integrating temporal dynamics with the structural relationships between entities.

However, deploying TGNNs on sensitive financial data raises significant privacy concerns.
Horizontal Federated Learning (HFL) offers a solution by enabling multiple institutions to collaboratively train a shared model without exchanging raw data.
In this post, we delve into the mathematical foundations of integrating TGNNs within an HFL framework to enhance credit card fraud detection while preserving data privacy.

<strong>Project overview:</strong>
- Implemented and trained a dynamic graph neural network (DGNN) in a <strong>horizontal federated learning</strong> (HFL) setting for anomalous and <strong>privacy preserving fraud detection</strong> of credit card transactions, <strong>successfully achieving $$>96\%$$ accuracy</strong> on datasets with upwards of 20 clients.
- Securely aggregated model weights from multiple banks without sharing customer data, reducing the risk of data breaches while maintaining model performance.
- Leveraged <strong>multi-GPU training</strong> for each participating bank and implemented efficient model aggregation, achieving a 20x speedup in overall training time and enabling near real-time fraud detection capabilities

<strong>Languages & Libraries:</strong> python, PyTorch, NumPy, scikit-learn, pandas, matplotlib

<strong>Prerequisites:</strong> graph neural networks, deep learning

---

Technical writeup in progress...
