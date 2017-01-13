import React, { PropTypes } from 'react';
import { calculate, WORST, BEST, CORRECT } from 'sm2-plus';
import Paper from 'material-ui/Paper'; import Star from 'material-ui/svg-icons/action/stars'; import Error from 'material-ui/svg-icons/alert/error';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Visibility from 'material-ui/svg-icons/action/visibility';
import Help from 'material-ui/svg-icons/action/help';
import { injectIntl, intlShape } from 'react-intl';
import { browserHistory } from 'react-router';
import Divider from 'material-ui/Divider';
import { connect } from 'react-redux';
import AppBar from '../common/components/appBar';
import { shrinkStyle, parentStyle } from '../common/styles';
import { setItemContent, setItemTitle } from './action';
import Preview from '../common/components/markdown/preview';
import { getDaysSinceEpoch } from '../../common/tool';

const recentsIcon = <Visibility />;
const favoritesIcon = <Error />;
const nearbyIcon = <Star />;
const unsure = <Help />;

const markdownContent = `
//# sm2-plus

This is a JS implementation of a refined version of the SM2 space repetition learning algorithm invented by [**BlueRaja**][br] overcoming some of the inherent issues of the original version.
Details about what these issuses are and how [**BlueRaja**][br] solved them can be found in this [post][original].

//## Installation


//## Usage



//## Algorithm Abstract

Each item should be stored as the following structure:
- difficulty:
   How difficult the item is, from [0.0, 1.0].  Defaults to 0.3 (if the software has no way of determining a better default for an item).
- interval: 
  How many days should occur between review attempts for this item.
- update:
  The last date this item was reviewed.

When reviewing item,  choose a performanceRating from [0.0, 1.0], with 1.0 being the best.  Set a cutoff point for the answer being “correct” (default is 0.6). Then the item data can be updated using the way described below:
- percentOverdue= (today - update) / interval) (2 <= percentOverdue)

- difficulty = difficulty + percentOverdue * (8 - 9 * performanceRating) / 17 (0 <= difficulty <= 1)

- difficultyWeight = 3 - 1.7 * difficulty

- interval =
  - 1 + (difficultyWeight - 1) * percentOverdue (for correct answer)
  - 1 / difficultyWeight / difficultyWeight (for incorrect answer)


[original]:http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2
[br]:http://www.blueraja.com/blog/author/blueraja

`;
const testQuestion = {
  quiz: {
    content: `
When reviewing item,  choose a performanceRating from [0.0, 1.0], with 1.0 being the best.  Set a cutoff point for the answer being “correct” (default is 0.6). Then the item data can be updated using the way described below:
- percentOverdue= (today - update) / interval) (2 <= percentOverdue)

- difficulty = difficulty + percentOverdue * (8 - 9 * performanceRating) / 17 (0 <= difficulty <= 1)
    `,
    title: "Describe the 'this' mechanism of the javascript language",
  },
  difficulty: 0.2,
  update: getDaysSinceEpoch() - 17,
  dueDate: 187987,
  interval: 100,
  id: 1234,
  answer: {
    content: markdownContent,
  },
};
class n extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index: 0, opened: false };
    this.toggle = this.toggle.bind(this);
    this.chose = this.chose.bind(this);
    this.goOver = this.goOver.bind(this);
    this.normal = this.normal.bind(this);
    this.fm = this.props.intl.formatMessage;
    this.progress = [];
    this.today = getDaysSinceEpoch();
    this.process = this.props.goOver ? this.goOver : this.normal;
  }

  goOver(score) {
    const p = { id: this.props.questions[this.state.index].id };

    // p.goOver = score === BEST ? false : true;
    if (score === BEST) {
      p.goOver = false;
    } else {
      p.goOver = true;
    }

    this.progress.push(p);
  }

  normal(score) {
    const question = this.props.questions[this.state.index];
    this.progress.push({
      ...calculate(question, score, this.today),
      id: question.id,
    });
  }

  chose(choice) {
    this.process(choice);
    let index = this.state.index + 1;
    if (index === this.props.questions.length) {
      this.props.finish(this.progress);
      index = 0;
    }

    this.setState({
      index,
    });
    this.toggle();
  }

  toggle() {
    this.setState({
      opened: !this.state.opened,
    });
  }

  bottom() {
    if (this.state.opened) {
      return (
        <BottomNavigation selectedIndex = { 10 }>
          <BottomNavigationItem
            label = { this.fm({ id: 'btn.forgotten' }) }
            icon = { favoritesIcon }
            onTouchTap = { () => this.chose(WORST) }
          />
          <BottomNavigationItem
            label = { this.fm({ id: 'btn.sure' }) }
            icon = { nearbyIcon }
            onTouchTap = { () => this.chose(BEST) }
          />
          <BottomNavigationItem
            label = { this.fm({ id: 'btn.unsure' }) }
            icon = { unsure }
            onTouchTap = { () => this.chose(CORRECT) }
          />
        </BottomNavigation>
      );
    }

    return (
      <BottomNavigation selectedIndex = { 10 }>
        <BottomNavigationItem
          label = { this.fm({ id: 'btn.seeAnswer' }) }
          icon = { recentsIcon }
          onTouchTap = { this.toggle }

          // onTouchTap = { () => console.info("hello") }
        />
      </BottomNavigation>
    );
  }

  render() {
    const { answer } = this.props.questions[this.state.index];
    return (
      <div
        style = { { ...parentStyle,
          height: '100%',
        } }
      >
        <AppBar
          title = 'appbar.study'
        />
        <h4 >
          {this.props.questions[this.state.index].quiz.title }
        </h4>
        <div
          style = { { ...shrinkStyle,
            flexGrow: 10,
          } }
        >
          <Preview
            preview = { true }
            content = {
              this.props.questions[this.state.index].quiz.content
            }
          />
          {
            (() => {
              if (this.state.opened) {
                return (
                  <div >
                    <Divider />
                    <Preview
                      preview = { true }
                      content = { answer ? answer.content : this.fm({ id: 'notice.noAnswerYet' }) }
                    />
                  </div>
                );
              }
            })()
          }
        </div>
        <Paper zDepth = { 1 }>
          {this.bottom()}
        </Paper>
      </div>
    );
  }
}

n.propTypes = {
  intl: intlShape.isRequired,
  questions: PropTypes.array,
  goOver: PropTypes.bool,
  finish: PropTypes.func,
};

export default connect(
  ({ app: {
    quiz: { item: { preview, title, content } },
    question: { goOver },
  } }) => ({
    questions: [testQuestion, { ...testQuestion, answer: undefined }],
    goOver,
  }),
  dispatch => ({
    finish: questions => {
      dispatch({
        type: 'UPLOAD_PROGRESS',
        questions,
      });
    },
  }),
)(injectIntl(n));
