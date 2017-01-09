import Quiz from './model/quiz';
import Question from './model/question';
import Answer from './model/answer';

const mockData = async data => {
  const length = data.length;
  for (let i = 0; i < length; i += 1) {
    const d = data[i];
    let quiz;
    let answer;
    if (d.quiz) {
      quiz = new Quiz(d.quiz);
      await quiz.save();
    }

    if (d.answer) {
      answer = new Answer({ ...d.answer, quiz: quiz._id });
      await answer.save();
    }

    if (d.question) {
      const q = new Question({
        quiz: quiz._id, answer: answer._id, ...d.question });
      await q.save();
    }
  }
};

export default mockData;
