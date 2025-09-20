---
title: "PyBuddy: A Local-First LLM Coding Assistant for Everyone"
date: "2025-09-09"
description: "A Small Language Model based Python Coding Assistant for Low Resource Devices."
tags: ["llm", "on-device inference", "code-assistant"]
readTime: "6 min read"
author: "Taufiq"
---


LLM Coding assistant or LLM Chatbots has become a daily companion to programmers and CS students. Today, when learning something completely new, we often start by asking ChatGPT, Claude, or Perplexity. When encounter an unknown error, we let them explain or point us to valid references on the internet. When searching online resources, many prefer Perplexity since it answers with citations. Some of us also use these tools to review code quality, reduce complexity, or write docstrings.


![Photo by Clay Banks on Unsplash](https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)


**However, the major drawbacks of these commercial chat bots are:**  

- **Usage Limit:** Free versions have tight usage caps. We often get cut off mid-task.

- **Context Window:** Uploading multiple files or using specialized tools shrinks the context-window, forcing us to leave the conversation at the middle.

- **Privacy:** Providers often use chat data to improve their products. This is a concern for confidential projects and research.

- **Instability:** At peak hours, access can slow down or get blocked, though rare.

- **Flexibility:** Sharing an entire codebase, like a GitHub repository, isn’t feasible due to project structure constraints. File limits and privacy issues make it worse.

- **Moderation:** Content filters limit specialized topics in cybersecurity or ethical hacking. Even when used for learning.

The list could go on. As at the end of the day, we’re using someone else’s tool, which is built for general use, not for our specific workflows.

## What’s Now?

A personalized on-device LLM code assistant can be a robust solution. Imagine a tool that runs entirely on your own hardware and is:

- **Completely free:** No cloud costs means no subscription fees.

- **Truly private:** Your code stays on your device. No uploads and no data harvesting.

- **Python-specialized:** Fine-tuned specifically for Python development rather than general chat.

- **Large context window:** Process entire codebases without hitting artificial limits.

- **Fully customizable:** Adapt the model's behavior and knowledge to your preferences.

- **Unlimited tool use:** No limitation on RAG, Deep Research, Resoning.

- **Unrestricted:** No content filters blocking legitimate security research or technical topics.

Sounds powerful, right? But building this comes with challenges.

### Challenges and Thoughts

**1. Training on Large Datasets:**

Python coding datasets are now widely available. But the real bottleneck is hardware. A full fine-tuning a large model (e.g., Meta Llama-3-70B) can require ~500 GB GPU memory during training. And that’s huge. Instead of full fine-tuning, we can rely on Parameter-Efficient Fine-Tuning (PEFT) and quantization. For example, using LoRA reduces the requirement to about 150 GB, while QLoRA brings it down to around 40 GB. Choosing a smaller model cuts the need even further. With optimized coding and parameters, Meta Llama-3-8B can run on just ~6 GB of GPU memory, compared to ~55 GB for full fine-tuning.

The practical approach is to pick the right Small Language Model (SLM) by analyzing coding benchmarks (e.g., Hugging Face Open Leaderboard) and fine-tuning it on a custom dataset using free or affordable GPU provided by Colab, Kaggle, NiceGPU, vast.ai, etc. Kaggle, for instance, provides either 2×Tesla T4 GPUs (~30 GB total) or 1×Tesla P100 (16 GB) for up to 30 hours per week. NiceGPU, in beta, offers 10 Neural Compute Units (NCU), where 1 NCU equals an RTX 4090 (24 GB) for 50 hours. Also, instead of feeding a huge dataset at once, the model can be trained incrementally with smaller datasets, improving gradually over time.

**2. Inference**

Inference poses another challenge. While GPUs ensure faster inference, they are not widely accessible to many developers and students due to budget limits. This makes CPU-based inference the more realistic target. The main problems here are latency and excessive RAM usage. A solution is to quantize the fine-tuned model into 4-bit or 8-bit integers, which reduces memory and speeds up inference. Converting the model into GGUF format also helps, as it is highly optimized for resource-constrained devices.

## The PyBuddy Project

I’ve built a project called slm-python-buddy for efficient fine-tuning and inference on resource-constrained devices. The fine-tuning process uses LoRA with quantization, and the resulting model is converted into an 8-bit GGUF file for optimized inference.

As a proof of concept, I fine-tuned Qwen2.5-Coder-1.5B-Instruct on a Python instruction dataset and tested it on multiple devices to measure feasibility:

- **Model size:** 1.6 GB (8-bit quantized)

- **Inference speed:**

    ~70–120 tokens/sec on AMD Ryzen 5 5000 CPU (16 GB RAM)

    ~7–12 tokens/sec on Redmi Note 13 (Snapdragon 685, 8 GB RAM)

    ~7-10 tokens/sec on Redmi Note 11 (Snapdragon 680, 4 GB RAM)

These results show that small models can run effectively on budget hardware. The model size can be reduced further, and inference speed can improve with optimizations such as faster matrix multiplication and CPU-architecture-aware threading. These are part of my ongoing experiments.

You can explore the GitHub repository for usage details. The project is regularly updated and can also be reused to fine-tune other Hugging Face models on custom datasets.

Now that we have a working setup for creating efficient Python coding models, the next logical step is deployment. How do we actually run these fine-tuned models on our local machines? Fortunately, there are several flexible approaches that work across different platforms and hardware constraints.

## How to use LLMs on Local?

### CLI Options

- **Ollama:** Install ollama on your computer and run a model with ollama run <model_name>.

- **llama.cpp:** Install llama.cpp and run a model with llama-cli -m <model_name> -p "<prompt>".

- **Python SDK:** Install the Python bindings for llama.cpp named llama-cpp-python and follow their doc for implementation.

```py
# ! pip install llama-cpp-python
from llama_cpp import Llama
model = Llama(model_path='<model_path>')
output = model.create_chat_completion(messages=[], max_tokens=1024)
```

### GUI Options

If you prefer a graphical interface, you can try:

- **Jan.AI:** User-friendly interface for local inference.

- **msty.ai:** Another GUI option with some additional tools.

- **More:** See Hugging Face’s local app list: https://huggingface.co/docs/hub/en/local-apps.

### Android Options

- **Llama Chat:** Install the app from playstore. Then Import the GGUF file into the app and run inference locally. It works like your personal ChatGPT, with customization options such as context_window and max_tokens.

- **Termux:** Install Termux from the Play Store to get a Linux-like environment and run Ollama, llama.cpp, or the Python SDK directly on your phone.

## What’s Next?

Remember those initial frustrations we discussed? Token limits, privacy concerns, context restrictions, and inflexibility of commercial chatbots? The PyBuddy project is just the beginning of addressing these challenges comprehensively.

I plan to make slm-python-buddy a community-driven project that tackles each of these problems head-on. If you're an open-source enthusiast who's tired of hitting paywalls mid-coding session or worried about your proprietary code being used for training, I'd love to invite you to contribute.

**Here are some of the key goals for the community project that directly address our original pain points:**

- Extending it for highly optimized fine-tuning on consumer and free GPUs, with easier and more flexible hyperparameter tuning.

- Further optimize inference for faster performance.

- Continuously collect data and fine-tune open-source models to develop a highly capable LLM Code Assistant.

- Integrate built-in tools such as RAG, Search, Code Runner, and others to support larger context windows and richer knowledge bases.

- Build flexible mobile apps, desktop apps, or terminal tools that bundle the values described earlier.

- And most importantly: everything developed under this project will remain free and open-source forever.

Everything big starts with something small. The steps we are taking today may someday grow into a powerful, affordable, and widely accessible open-source code assistant that solves all the problems we started with. It could even become developers' first choice, not because commercial chatbots are costly, but because our solution is simply better for coding.

## Resources

- **Code:** [https://github.com/taufiq-ai/slm-python-buddy](https://github.com/taufiq-ai/slm-python-buddy){:target="_blank"}

- **Models:** [huggingface.co/taufiq-ai/qwen2.5-coder-1.5-instruct-ft](https://huggingface.co/taufiq-ai/qwen2.5-coder-1.5-instruct-ft){:target="_blank"}

- **Android Demo:** [www.youtube.com/watch?v=GkIkqUldQak](https://www.youtube.com/watch?v=GkIkqUldQak){:target="_blank"}