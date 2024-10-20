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

## Temporal Graph Neural Networks (TGNNs)
### Modeling Transaction Networks
In order to train our model, we must first construct a graph from our available data.
Credit card transactions can be naturally represented as a temporal graph. Formally, let $$ G = (V, E, T) $$ denote a temporal graph where:
- $$V$$ is the set of nodes representing credit card accounts.
- $$E \subset V \times V $$ is the set of edges representing transactions between accounts.
- $$T$$ is the set of timestamps associated with each edge.
Each edge $$e=(u,v,t)$$ carries features $$x_e$$ (e.g., transaction amount, merchant category) and may have an associated label $$y_e$$ indicating whether the transaction is fraudulent.

Depending on the available data, one can also construct a heterogenous graph with two seperate node sets, one for users and another for vendors.

[Insert snapshot of dataset]
### TGNN Architecture
TGNNs extend traditional Graph Neural Networks by incorporating temporal information into the message-passing framework. The node embeddings $$h_v^t$$ evolve over time based on interactions with neighboring nodes.

The general update equations are:
1. **Message Function**:

    $$m_{u \rightarrow v}^{t} = \phi(h_u^{t^-}, h_v^{t^-}, x_{e}, t - t_{uv})$$

    where:
    * $$\phi$$ is a learnable function.
    * $$h_u^{t^-}$$ is the embedding of node $u$ just before time $$t$$.
    * $$t_{uv}$$ is the time of the last interaction between $$u$$ and $$v$$.

2. **Aggregation Function**:

   $$m_v^{t} = \sum_{u \in \mathcal{N}_v^{t}} m_{u \rightarrow v}^{t}$$

   where $$\mathcal{N}_v^{t}$$ is the set of nodes interacting with $$v$$ at time $$t$$.

3. **Update Function**:

   $$h_v^{t} = \psi(h_v^{t^-}, m_v^{t})$$

   where $$\psi$$ is another learnable function.

By iteratively applying these functions, the TGNN captures temporal dependencies and relational patterns crucial for identifying fraudulent activities.

---

## Horizontal Federated Learning (HFL)
Federated learning enables multiple clients to collaboratively train a global model $$\theta$$ without sharing their local data.
Each client computes model updates using their data and sends these updates to a central server, which aggregates them to update the global model.
Federated learning has found incredible success in the healthcare industry [[2](https://www.nature.com/articles/s41598-023-28974-6)] [[3](https://pmc.ncbi.nlm.nih.gov/articles/PMC10418741/)], mobile applications [[4](https://engineering.fb.com/2022/06/14/production-engineering/federated-learning-differential-privacy/)], and is showing promise in training autonomous vehicles [[4](https://liangqiy.com/publication/a_survey_of_federated_learning_for_connected_and_automated_vehicles/A_Survey_of_Federated_Learning_for_Connected_and_Automated_Vehicles.pdf)]

Federated learning comes in several varieties, each designed to address specific data distribution scenarios and privacy requirements. 
Horizontal federated learning, also known as sample-based federated learning, is used when different participants have the same feature space but different samples. 
This is the most common type of federated learning and is often seen in scenarios where:
- Multiple organizations have similar types of data (e.g., different banks with customer transaction data)
- User devices contain personal data (e.g., smartphones with typing patterns for keyboard prediction)
In this approach, participants collaborate to train a shared model without exchanging raw data, only model updates.
For credit card fraud detection, different banks or financial institutions act as clients, each holding transaction data for their customers.

Vertical federated learning comes into play when participants have different feature sets but overlapping samples. This type is useful in scenarios such as:
- Multiple departments within a company have different data about the same customers
- Different organizations have complementary data about shared clients
Vertical federated learning allows these entities to combine their features to build a more comprehensive model without directly sharing data.

Lastly, federated transfer learning combines both horizontal and vertical federated learning and is often the most difficult to implemented. Figure 1. visulizes the subtle differences between the three types.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/fed-learning.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 1. Different classes of federated learning
</div>
---

## Integrating TGNN with HFL

### Problem Formulation
Our objective is to train a global TGNN model $$\theta$$ for fraud detection by leveraging decentralized transaction data across multiple institutions while ensuring data privacy.

Each client $$k$$ has its local transaction graph $$G_k = (V_k, E_k, T_k) $$, with node features $$X_k$$ and edge features $$E_k$$.

Each client minimizes a local loss function:

$$\mathcal{L}_k(\theta) = \frac{1}{|E_k|} \sum_{(e, y_e) \in E_k} \ell(f_\theta(e), y_e)$$

where:
- $$f_\theta(e)$$ is the TGNN's prediction for edge $$e$$.
- $$\ell$$ is a loss function (e.g., cross-entropy loss).

The federated learning process then works like this:

1. **Initialization**: The central server initializes the global model parameters $$\theta_0$$ and broadcasts them to all clients.

2. **Local Training**: Each client $$k$$ performs local training for $$E$$ epochs using its data $$D_k$$:

   $$\theta_k = \theta_{t-1} - \eta \nabla \mathcal{L}_k(\theta_{t-1})$$

   where $$\eta$$ is the learning rate.

3. **Model Upload**: Clients send the updated parameters $$\theta_k$$ to the server.

4. **Aggregation**: The server aggregates the client models to update the global model:

   $$\theta_t = \sum_{k=1}^{K} \frac{n_k}{n} \theta_k$$

   where:
   - $$K$$ is the number of clients.
   - $$n_k$$ is the number of samples at client $$k$$.
   - $$n = \sum_{k=1}^{K} n_k$$.

5. **Iteration**: Steps 2–4 are repeated for multiple rounds until convergence.

Steps 2-4 can also be invoked after certain periods of elapsed time.
In step 4, the weighted average ensures that clients with more data have a proportionally larger influence on the global model. To further protect sensitive transaction data, clients can implement differential privacy by adding noise to their model updates, ensuring that the influence of any single transaction on the model update is limited.

## Experimental Results

Write up in progress...
