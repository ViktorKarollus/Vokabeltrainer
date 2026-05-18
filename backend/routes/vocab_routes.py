from flask import Blueprint
from flask import request, jsonify, session
from backend.database.vocab import set_phase, add_vocab, delete_vocab
from backend.database.lesson import get_vocabularies_of_lesson, add_lesson, delete_lesson
from backend.database.user import add_user, get_user_lessons
from backend.logic.vocab_stats import get_vocab_stats
vocab_routes = Blueprint('vocab_routes', __name__)  # Blueprint for vocab_routes

@vocab_routes.route('/vocab/answer', methods=['POST'])# Endpoint to answer a vocabulary question
def answer_vocab_route():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
    word_foreign = data.get('word_foreign')
    username = data.get('username')
    lesson_name = data.get('lesson_name')
    correct = data.get('correct')
    if not all([word_foreign, username, lesson_name, isinstance(correct, bool)]):
        return jsonify({'error': 'Invalid input'}), 400
    vocab = set_phase(word_foreign=word_foreign, username=username, lesson_name=lesson_name, answer_bool=correct)
    if vocab is None:
        return jsonify({'error': 'Vocabulary word not found'}), 404
    return jsonify({"word_foreign": vocab.word_foreign, "new_phase": vocab.vocab_phase, "correct": correct}), 200

@vocab_routes.route('/users/<username>/lessons/<lesson_name>/vocab', methods=['GET'])# Get vocabularies of a lesson for a user
def get_lesson_vocab_route(username, lesson_name):
    vocabularies = get_vocabularies_of_lesson(lesson_name, username)
    return jsonify([{
        "word_foreign": vocab.word_foreign,
        "word_native": vocab.word_native,
        "vocab_phase": vocab.vocab_phase,
        "lesson_name":lesson_name
    } for vocab in vocabularies]), 200

@vocab_routes.route('/users/<username>/lessons', methods=['POST'])# Create a new lesson for a user
def create_lesson_route(username):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data= request.get_json()
    if data is None:
        return jsonify({'error': 'No input data provided'}), 400
    lesson_name = data.get('lesson_name')
    if not lesson_name:
        return jsonify({'error': 'Invalid input'}), 400
    lesson=add_lesson(lesson_name, username)
    if lesson is None:
        return jsonify({'error': 'Lesson could not be created'}), 400
    return jsonify({"lesson_name": lesson.lesson_name, "user_id": lesson.user_id}), 201

@vocab_routes.route('/users/<username>/lessons/<lesson_name>/vocab', methods=['POST']) # Add vocabulary to a lesson
def add_vocab_to_lesson_route(username, lesson_name):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    if data is None:
        return jsonify({'error': 'No input data provided'}), 400
    word_foreign = data.get('word_foreign')
    word_native = data.get('word_native')
    if not all([word_foreign, word_native]):
        return jsonify({'error': 'foreign and native words are required'}), 400
    vocab = add_vocab(word_foreign, word_native, username, lesson_name)
    if vocab is None:
        return jsonify({'error': 'Vocabulary already exists'}), 409
    return jsonify({
        "word_foreign": vocab.word_foreign,
        "word_native": vocab.word_native,
        "phase": vocab.vocab_phase
    }), 201

@vocab_routes.route('/users',methods=['POST'])# Endpoint to create a new user
def create_user_route():
    data= request.get_json()
    if data is None:
        return jsonify({'error': 'No input data provided'}), 400
    username = data.get('username')
    password = data.get('password')
    if not all([username, password]):
        return jsonify({'error': 'Invalid input'}), 400
    user = add_user(username, password)
    if user is None:
        return jsonify({'error': 'User already exists'}), 409
    session['user_id'] = user.id
    session['username'] = user.username
    return jsonify({"username": user.username, "rank": user.rank}), 201

@vocab_routes.route('/users/<username>/lessons', methods=['GET'])# Get all lessons of a user
def get_user_lessons_route(username):
    lessons = get_user_lessons(username)
    return jsonify([{
        "lesson_name": lesson.lesson_name,
        "user_id": lesson.user_id,
        "id":lesson.id
    } for lesson in lessons]), 200


@vocab_routes.route('/users/<username>/lessons/<lesson_name>', methods=['DELETE'])# Delete a lesson for a user
def delete_lesson_route(username, lesson_name):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    lesson=delete_lesson(lesson_name, username)
    if lesson is None:
        return jsonify({'error': 'Lesson not found'}), 404
    return jsonify({"lesson_name": lesson.lesson_name, "user_id": lesson.user_id}), 200


@vocab_routes.route('/users/<username>/lessons/<lesson_name>/vocab/<word_foreign>', methods=['DELETE'])# Delete a vocabulary word from a lesson
def delete_vocab_route(username, lesson_name, word_foreign):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    vocab=delete_vocab(word_foreign, username, lesson_name)
    if vocab is None:
        return jsonify({'error': 'Vocabulary word not found'}), 404
    return jsonify({"word_foreign": vocab.word_foreign, "word_native": vocab.word_native}), 200


@vocab_routes.route('/users/<username>/stats', methods=['GET'])# Get user statistics
def get_user_stats_route(username):
    lessons = get_user_lessons(username)
    vocabularys=[vocab for lesson in lessons for vocab in lesson.vocabularies]
    stats = get_vocab_stats(vocabularys)
    return jsonify(stats), 200


@vocab_routes.route('/me', methods=['GET'])# Get current logged in user
def get_current_user_route():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    user_name = session.get('username')
    return jsonify({'username': user_name}), 200