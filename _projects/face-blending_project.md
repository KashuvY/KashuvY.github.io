---
layout: page
title: Image blending using Laplacian pyramids
description: (Write up in progress...)
img: assets/img/lapl-pyr.png
importance: 2
category: fun
in_progress: true
---
Suppose you want to downsample and image $I$ (shrink it so it contains less pixels). One reason you would want to do this is to compress it.

A naive approach might be to simply keep every nth pixel:

$$I_{\text{down}}(x,y) = I(nx, ny)$$

where n is the downsampling factor.

This approach can lead to aliasing artifacts due to high-frequency components in the original image. Consider the Nyquist-Shannon sampling theorem: to accurately represent a signal, you must sample at least twice the highest frequency present.

To avoid aliasing, we first apply a low-pass filter to remove high-frequency components:

$$I_{\text{smooth}} = I * G$$

where * denotes convolution and G is a Gaussian kernel:

$$G(x, y) = \frac{1}{2\pi\sigma^2} e^{-\frac{x^2 + y^2}{2\sigma^2}}$$

The standard deviation σ is typically chosen based on the downsampling factor:

$$\sigma = \frac{n}{2\sqrt{2\ln(2)}}$$


Building on our understanding of downsampling, let's explore how to blend two images, $I_1$ and $I_2$, using Laplacian pyramids.
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/blended-fruit.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
First, we create a Gaussian pyramid for each image:

$$G_i^{(k)} = \text{downsample}(G_{i-1}^{(k)} * G)$$

where $k \in \{1,2\}$ denotes the image, $i$ is the pyramid level, and $G$ is the Gaussian kernel.

The Laplacian pyramid captures the details lost in each downsampling step:

$$L_i^{(k)} = G_i^{(k)} - \text{upsample}(G_{i+1}^{(k)})$$

The upsampling operation involves increasing image size and smoothing:

$$\text{upsample}(I) = (I_{\text{enlarged}} * G) * 4$$

where $I_{\text{enlarged}}$ is $I$ with zeros inserted between each pixel.

Create a mask $M$ (same size as the images) to guide the blending. Values should be in [0, 1], where 0 means use $I_1$ and 1 means use $I_2$. Build a Gaussian pyramid for $M$:

$$M_i = \text{downsample}(M_{i-1} * G)$$

Blend the Laplacian pyramids using the mask:

$$L_i^{(\text{blend})} = L_i^{(1)} \cdot (1 - M_i) + L_i^{(2)} \cdot M_i$$

Reconstruct the blended image by summing the Laplacian pyramid levels:

$$I_{\text{blend}} = L_N^{(\text{blend})} + \sum_{i=0}^{N-1} \text{upsample}(L_{i+1}^{(\text{blend})})$$

where $N$ is the number of pyramid levels.