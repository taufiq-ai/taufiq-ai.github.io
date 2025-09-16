---
layout: post
title: "EXAONE-3.5-2.4B: A Ultra-lightweight but High Performing LLM on Just 6GB GPU"
description: "An ultra-lightweight opensource LLM for on-device use"
date: 2025-01-04
tags: [llm, on-device]
author: Taufiq
photo: https://cdn.hashnode.com/res/hashnode/image/upload/v1735936115968/8e583ec6-f2b6-4f70-9c94-f7d8c2254946.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp
---

![img](https://cdn.hashnode.com/res/hashnode/image/upload/v1735936115968/8e583ec6-f2b6-4f70-9c94-f7d8c2254946.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp)

Today, there are many Large Language Models (LLMs) available, ranging from billions to trillions of parameters in size. While the list of LLMs is extensive, it becomes much shorter when considering in-house models with lower GPU requirements. Performance remains the critical factor, and finding a model that combines low GPU consumption with high performance is increasingly rare in today's landscape.

Recently, I explored the [EXAONE-3.5-2.4B-Instruct](https://huggingface.co/LGAI-EXAONE/EXAONE-3.5-2.4B-Instruct) model that was developed by LG AI Research. I specifically tested the model for various tasks including NER, Text Classification, Code Generation, Q&A, Summarization, Text Generation, and Article Generation. The results showed better performance compared to similar-sized models such as IBM's Granite 2B, Google's Gemma 2B, and Microsoft's Phi-2. Additionally, EXAONE-3.5-2.4B-Instruct consumes only ~6GB of GPU memory during inference using the pre-trained model.

## Background

Before diving into the details, let me share what led me to discover this model. I'm working on a RAG chatbot project that handles sensitive business data and requires high contextual understanding. The project faces several key challenges:

- **Data Security:** Sensitive business data that should not be exposed at any case.

- **Context Window:** Token count grows exponentially with chat history, making commercial LLM APIs like OpenAI and Anthropic prohibitively expensive.

- **Multi-Task Handling:** The system needs to handle diverse tasks including NER, Python & SQL code generation, moderation, segmentation, and RAG-based Q&A. This requires either a versatile single model or multiple specialized models.

- **Latency:** One task waits on another task's output, so latency should be minimal. Although the GPT 4o Mini, Claude 3.5 Haiku offer lower latency, they sometimes face overload issues.

- **Limited Budget:** GPU requirements should stay around 5GB for inference to remain cost-effective.

- **Accuracy:** High contextual understanding and accuracy is essential for reliable performance.

After evaluating these requirements, I explored several top-ranked smaller models from the Open LLM Leaderboard, such as tiiuae/Falcon3-1B-Instruct, google/gemma-2b, ibm-granite/granite-3.1-2b-instruct, microsoft/phi-2. EXAONE-3.5-2.4B-Instruct stood out for its strong contextual understanding, multi-task capabilities, efficient resource usage (only ~6GB GPU & 2GB RAM), and structured output formatting.

## Benchmark

EXAONE-3.5 comes in three variants: 2.4B, 7.8B, and 32B parameters. Below are benchmark comparison scores of the 2.4B & 7.8B variants against similar models.

![img]()

## Hardware Requirements

Testing was conducted using the Kaggle Free Tier with the following specifications:

- GPU: Tesla P100 16GB

- RAM: 29GB

- Disk: 60GB

After a 2-hour testing session, the resource consumption was notably efficient:

- GPU Memory: 6.3GB

- RAM Usage: ~2GB

- Disk Space: 11.1GB

## Code

Let's go through the [**Kaggle Notebook**](https://www.kaggle.com/code/taufiqtusar/exaone-3-5-2-4b-instruct-pre-trained-model-test) to explore the pretrained variant of EXAONE-3.5-2.4B-Instruct. The notebook is ready to run on the go - just do not forget to change the accelerator to GPU. It'll take approx. 3-4 minutes to setup the model and tokenizer. For detailed implementation guidelines, you can refer to the model's documentation [**here**](https://huggingface.co/LGAI-EXAONE/EXAONE-3.5-2.4B-Instruct).

I've explored the following use cases in this notebook:

1. Named Entity Recognition (NER)

2. Text Classification

3. Python & HTML Code Generation

4. Q&A

5. Text Summarization

6. Text Generation


## Future Works

Next, I plan to explore the following with **EXAONE-3.5-2.4B**:

- **Fine-tuning:** In this exploration, I used the pre-trained model for quick testing. For better output, fine-tuning is necessary. I believe the JSON formatting and context understanding will improve after fine-tuning.

- **Quantization:** This will optimize GPU consumption while maintaining the model's current knowledge in the fine-tuned version.

- **Multilingual Capability:** The EXAONE model currently performs well only in English and Korean, but I require multilingual capability. Further exploration is needed in this area.

## Conclusion

EXAONE-3.5-2.4B-Instruct demonstrates that smaller language models can deliver effective performance while being resource-efficient. With its modest ~6GB GPU requirement and strong capabilities across multiple NLP tasks, it serves as an excellent choice for production deployments where both performance and resource optimization are crucial.

You can find the documentation and implementation details in the notebook. Feel free to use the code for your use cases. Thank you.