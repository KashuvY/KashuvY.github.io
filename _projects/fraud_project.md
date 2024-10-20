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

<strong>Project overview:</strong>
- Implemented and trained a dynamic graph neural network (DGNN) in a <strong>horizontal federated learning</strong> (HFL) setting for anomalous and <strong>privacy preserving fraud detection</strong> of credit card transactions, <strong>successfully achieving $$>96\%$$ accuracy</strong> on datasets with upwards of 20 clients.
- Securely aggregated model weights from multiple banks without sharing customer data, reducing the risk of data breaches while maintaining model performance.
- Leveraged <strong>multi-GPU training</strong> for each participating bank and implemented efficient model aggregation, achieving a 20x speedup in overall training time and enabling near real-time fraud detection capabilities

<strong>Languages & Libraries:</strong> python, PyTorch, NumPy, scikit-learn, pandas, matplotlib

<strong>Prerequisites:</strong> graph neural networks, deep learning

---


## Temporal Graph Neural Networks (TGNNs)

### Modeling Transaction Networks
Credit card transactions can be naturally represented as a temporal graph. Formally, let $$G = (V, E, T)$$ denote a temporal graph where:
- $$V$$ is the set of nodes representing credit card accounts.
- $$E \subset V \times V $$ is the set of edges representing transactions between accounts.
- $$T$$ is the set of timestamps associated with each edge.
Each edge $$e=(u,v,t)$$ carries features $$x_e$$ (e.g., transaction amount, merchant category) and may have an associated label $$y_e$$ indicating whether the transaction is fraudulent.

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

### Federated Learning Overview
Federated Learning enables multiple clients to collaboratively train a global model $$\theta$$ without sharing their local data. Each client computes model updates using their data and sends these updates to a central server, which aggregates them to update the global model.

### Horizontal Federated Learning
In Horizontal Federated Learning, clients possess datasets with the same feature space but different samples. For credit card fraud detection, different banks or financial institutions act as clients, each holding transaction data for their customers.

---

## Integrating TGNN with HFL

### Problem Formulation
Our objective is to train a global TGNN model $$\theta$$ for fraud detection by leveraging decentralized transaction data across multiple institutions while ensuring data privacy.

Each client $$k$$ has its local transaction graph $$G_k = (V_k, E_k, T_k) $$, with node features $$X_k$$ and edge features $$E_k$$.

### Local Training Objective
Each client minimizes a local loss function:

$$\mathcal{L}_k(\theta) = \frac{1}{|E_k|} \sum_{(e, y_e) \in E_k} \ell(f_\theta(e), y_e)$$

where:
- $$f_\theta(e)$$ is the TGNN's prediction for edge $$e$$.
- $$\ell$$ is a loss function (e.g., cross-entropy loss).

### Federated Learning Process

1. **Initialization**: The central server initializes the global model parameters $\theta_0$ and broadcasts them to all clients.

2. **Local Training**: Each client $k$ performs local training for $E$ epochs using its data $D_k$:

   $$\theta_k = \theta_{t-1} - \eta \nabla \mathcal{L}_k(\theta_{t-1})$$

   where $$\eta$$ is the learning rate.

3. **Model Upload**: Clients send the updated parameters $$\theta_k$$ to the server.

4. **Aggregation**: The server aggregates the client models to update the global model:

   $$\theta_t = \sum_{k=1}^{K} \frac{n_k}{n} \theta_k$$

   where:
   - $$K$$ is the number of clients.
   - $$n_k = |D_k|$$ is the number of samples at client $$k$$.
   - $$n = \sum_{k=1}^{K} n_k$$.

5. **Iteration**: Steps 2–4 are repeated for multiple rounds until convergence.

## Mathematical Details

### Message Passing in TGNN

The message and update functions are instantiated as:

1. **Message Function**:
   $$m_{u \rightarrow v}^{t} = \sigma\left(W_m [h_u^{t^-} \, \| \, h_v^{t^-} \, \| \, x_{e} \, \| \, \delta_t]\right)$$

   where:
   - $$\sigma$$ is an activation function (e.g., ReLU).
   - $$W_m$$ is a learnable weight matrix.
   - $$\delta_t = t - t_{uv}$$ is the time since the last interaction.
   - $$\|$$ denotes concatenation.

2. **Update Function**:
   $$h_v^{t} = \sigma\left(W_u [h_v^{t^-} \, \| \, m_v^{t}]\right)$$

   where $$W_u$$ is another learnable weight matrix.

### Loss Function

For binary fraud detection, the cross-entropy loss is:

$$\ell(f_\theta(e), y_e) = -\left[y_e \log f_\theta(e) + (1 - y_e) \log(1 - f_\theta(e))\right]$$

### Federated Averaging

The aggregated global model parameters are computed as:

$$\theta_t = \sum_{k=1}^{K} \frac{n_k}{n} \theta_k$$

This weighted average ensures that clients with more data have a proportionally larger influence on the global model.

## Privacy Preservation

### Differential Privacy

To protect sensitive transaction data, clients can implement differential privacy by adding noise to their model updates:

1. **Gradient Clipping**:
   $$\tilde{g}_k = \frac{g_k}{\max\left(1, \frac{\| g_k \|_2}{S} \right)}$$

   where $$S$$ is the clipping threshold.

2. **Noise Addition**:
   $$\hat{g}_k = \tilde{g}_k + \mathcal{N}(0, \sigma^2 S^2 I)$$

   where:
   - $$\mathcal{N}(0, \sigma^2 S^2 I)$$ represents Gaussian noise with mean zero and covariance $$\sigma^2 S^2 I$$.
   - $$\sigma$$ controls the noise scale.

This mechanism ensures that the influence of any single transaction on the model update is limited, providing formal privacy guarantees.

## Convergence Analysis

### Assumptions

- **Smoothness**: Each local objective $$\mathcal{L}_k(\theta)$$ is $$L$$-smooth:
  $$\|\nabla \mathcal{L}_k(\theta_1) - \nabla \mathcal{L}_k(\theta_2)\| \leq L \|\theta_1 - \theta_2\|$$

- **Bounded Variance**: The variance of the stochastic gradients is bounded:
  $$\mathbb{E}_{\xi \sim D_k} \left[ \|\nabla_\theta \ell(\theta; \xi) - \nabla \mathcal{L}_k(\theta)\|^2 \right] \leq \sigma_k^2$$

- **Unbiased Gradients**: The local gradients are unbiased estimates of the true gradient:
  $$\mathbb{E}_{\xi \sim D_k} \left[ \nabla_\theta \ell(\theta; \xi) \right] = \nabla \mathcal{L}_k(\theta)$$

### Convergence Rate

Under these assumptions, the convergence rate of federated averaging can be characterized as:

$$\mathbb{E}\left[\mathcal{L}(\theta_t) - \mathcal{L}(\theta^*)\right] \leq \frac{L}{2 t \eta} \left\| \theta_0 - \theta^* \right\|^2$$

where:
- $$\theta_t$$ is the global model at round $t$.
- $$\theta^*$$ is the optimal model parameters.
- $$\eta$$ is the learning rate.

Proper choice of $$\eta$$ and sufficient communication rounds $$t$$ ensure convergence to the optimal solution.

## Communication Efficiency

### Reducing Communication Overhead

Communication between clients and the server can be a bottleneck. Techniques to mitigate this include:

- **Model Compression**: Clients transmit compressed model updates using methods like sparsification or quantization.
- **Periodic Communication**: Clients perform multiple local updates before communicating with the server.
- **Adaptive Communication**: Adjusting the communication frequency based on model convergence metrics.

Mathematically, if $$\theta_k^\tau$$ represents the model after $$\tau$$ local updates, clients send $$\theta_k^\tau - \theta_{t-1}$$, reducing the amount of data transmitted.

## Experimental Setup

While actual experimental results are beyond this scope, a typical setup would involve:

- **Dataset**: Real or simulated credit card transaction data partitioned across multiple institutions.

- **Baselines**:
  - Centralized TGNN model trained on aggregated data (serves as an upper bound).
  - Local TGNN models trained independently by each client.
  - Federated models without temporal or graph components.

- **Metrics**:
  - **Detection Performance**: Precision, recall, F1-score, area under the ROC curve.
  - **Communication Efficiency**: Total data transmitted, number of communication rounds.
  - **Privacy Metrics**: Differential privacy parameters (e.g., privacy budget $\varepsilon$).

### Expected Outcomes

- The federated TGNN should achieve performance close to the centralized model while preserving data privacy.
- Communication-efficient techniques should reduce overhead without significantly impacting model accuracy.
- Differential privacy mechanisms should provide strong privacy guarantees with minimal loss in detection performance.

## Conclusion

Integrating Temporal Graph Neural Networks within a Horizontal Federated Learning framework provides a mathematically robust and practical approach to credit card fraud detection. This methodology effectively captures the intricate temporal and relational patterns in transaction data while ensuring that sensitive information remains secure.

By enabling collaborative model training across institutions without sharing raw data, financial entities can enhance their fraud detection capabilities collectively. The mathematical formulations and privacy-preserving techniques discussed lay a solid foundation for implementing and advancing these models in real-world applications.

## Future Work

- **Advanced Temporal Modeling**: Incorporate attention mechanisms or sequence modeling techniques to better capture long-term dependencies.
- **Personalized Federated Learning**: Develop methods that allow clients to adapt the global model to their local data distributions.
- **Enhanced Privacy Techniques**: Explore cryptographic approaches like secure multi-party computation or homomorphic encryption to further strengthen privacy.
- **Robustness to Heterogeneity**: Address challenges arising from non-IID data distributions across clients, ensuring fair performance improvements.

## Final Remarks

Mathematical rigor and privacy preservation are paramount when deploying machine learning models in sensitive domains like fraud detection. The fusion of TGNNs and Horizontal Federated Learning presents a promising avenue for both research and practical implementation, balancing performance with the critical need for data security.
