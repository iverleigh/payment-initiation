# Data Handling Imports
import pandas as pd
import numpy as np
import json

# NLP Imports
import re
import nltk
import string

# API Handling
import requests

# Machine Learning Imports
import scipy.stats
import sklearn
from sklearn.metrics import make_scorer
from sklearn.model_selection import train_test_split, cross_val_score, RandomizedSearchCV
import sklearn_crfsuite
from sklearn_crfsuite import scorers
from sklearn_crfsuite import metrics
from sklearn_crfsuite import CRF
from sklearn_crfsuite.metrics import flat_classification_report
from sklearn.metrics import classification_report, confusion_matrix
from sklearn_crfsuite import CRF as skCRF
from sklearn.externals import joblib



class CRF_NER:
    def __init__(self, model_filepath):
        self.model_filepath = model_filepath

    def load_model(self):
        self.crf = joblib.load(self.model_filepath)
        return self.crf

    def query(self, sentence):
        original_sentence = sentence
        sentence = re.sub(r"([a-z]+)([.()!])", r'\1 ', sentence)
        sentence = sentence.replace(".", " ")
        sentence = sentence.replace("?", " ")
        sentence = sentence.replace("!", " ")
        sentence = sentence.replace(",", "")
        sentence = sentence.strip()
        sentence = sentence.replace('[', "")
        sentence = sentence.replace(']', "")
        sentence = re.sub('[()""“”{}<>]', '', sentence)
        sentence = re.sub(r"\$([0-9+])", "$ \\1", sentence)

        sent_text = nltk.sent_tokenize(sentence)
        tokenized_text = nltk.word_tokenize(sentence)
        tagged = nltk.pos_tag(tokenized_text)

        def word2features(sent, i):
            word = sent[i][0]
            postag = sent[i][1]

            features = {
                'bias': 1.0,
                'word.lower()': word.lower(),
                'word[-3:]': word[-3:],
                'word[-2:]': word[-2:],
                'word.isupper()': word.isupper(),
                'word.istitle()': word.istitle(),
                'word.isdigit()': word.isdigit(),
                'postag': postag,
                'postag[:2]': postag[:2],
            }
            if i > 0:
                word1 = sent[i - 1][0]
                postag1 = sent[i - 1][1]
                features.update({
                    '-1:word.lower()': word1.lower(),
                    '-1:word.istitle()': word1.istitle(),
                    '-1:word.isupper()': word1.isupper(),
                    '-1:postag': postag1,
                    '-1:postag[:2]': postag1[:2],
                })
            else:
                features['BOS'] = True

            if i < len(sent) - 1:
                word1 = sent[i + 1][0]
                postag1 = sent[i + 1][1]
                features.update({
                    '+1:word.lower()': word1.lower(),
                    '+1:word.istitle()': word1.istitle(),
                    '+1:word.isupper()': word1.isupper(),
                    '+1:postag': postag1,
                    '+1:postag[:2]': postag1[:2],
                })
            else:
                features['EOS'] = True

            return features

        def sent2features(sent):
            return [word2features(sent, i) for i in range(len(sent))]

        def sent2labels(sent):
            return [label for token, postag, label in sent]

        def sent2tokens(sent):
            return [token for token, postag, label in sent]

        X = [sent2features(i) for i in [tagged]]

        pred = self.crf.predict(X)
        p = pred[0]
        result = {}
        for idx, i in enumerate(p):
            if i != 'O':
                result[i] = tagged[idx][0]

        return result