from flask import Flask, request, jsonify
import traceback
from NER import CRF_NER

#API definition
app = Flask(__name__)

@app.route('/predict', methods=['POST', 'GET'])
def predict():
    if request.method == 'POST': 
        if crf:
            print ('inside predict')
            try:
                json_ = request.json
                sentence = json_["email"]
                print(sentence)
                result = c.query(sentence)
                print(result)
                response = jsonify(result)
                response.headers.add('Access-Control-Allow-Origin', '*')
                print("sending response")
                print(response)
                return response
            except:

                return jsonify({'trace': traceback.format_exc()})
        else:
            print ('There is no trained model found.')
            return jsonify({'error':'no model found'})
    else:
        return jsonify({'error': 'no get request handler'})

if __name__ == '__main__':
    port = 5000
    model_filepath = 'crf_model_1.pkl'

    c = CRF_NER(model_filepath)
    crf = c.load_model()
    print ('Model loaded')

    app.run(port=port, debug=True)