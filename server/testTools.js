import Quiz from './model/quiz';
import Question from './model/question';
import Answer from './model/answer';
import User from './model/user';
import Cookie from './model/cookie';

export const mockData = async data => {
  const length = data.length;
  const ret = [];
  for (let i = 0; i < length; i += 1) {
    const d = data[i];
    let quiz;
    let answer;
    let question;
    if (d.quiz) {
      quiz = new Quiz(d.quiz);
      await quiz.save();
    }

    if (d.answer) {
      answer = new Answer({ ...d.answer, quiz: quiz._id });
      await answer.save();
    }

    if (d.question) {
      const tem = {
        ...d.question,
        quiz: quiz._id,
      };
      if (answer) {
        tem.answer = answer._id;
      }

      question = new Question(tem);
      await question.save();
    }

    ret.push({
      question,
      answer,
      quiz,
    });
  }

  return ret;
};

export const createUerAndCookie = async () => {
  const user = new User();
  user.password = '12341234u';
  user.firstName = 'first';
  user.lastName = 'last';
  user.userName = 'username';
  await user.save();
  const cookie = new Cookie();
  cookie.expireAt = new Date();
  cookie.uid = user._id;
  await cookie.save();
  return { cookie, user };
};
