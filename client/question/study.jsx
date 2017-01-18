import React, { PropTypes } from 'react';
import { calculate, WORST, BEST, CORRECT } from 'sm2-plus';
import Paper from 'material-ui/Paper'; import Star from 'material-ui/svg-icons/action/stars';
import Error from 'material-ui/svg-icons/alert/error';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Visibility from 'material-ui/svg-icons/action/visibility';
import Help from 'material-ui/svg-icons/action/help';
import { injectIntl, intlShape } from 'react-intl';
import Divider from 'material-ui/Divider';
import { connect } from 'react-redux';
import AppBar from '../common/components/appBar';
import { shrinkStyle, parentStyle } from '../common/styles';
import Preview from '../common/components/markdown/preview';
import { getDaysSinceEpoch } from '../../common/tool';

const recentsIcon = <Visibility />;
const favoritesIcon = <Error />;
const nearbyIcon = <Star />;
const unsure = <Help />;

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
    const goOver = score !== BEST;
    this.progress.push({
      ...calculate(question, score, this.today),
      id: question.id,
      goOver,
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
    question: { goOver, questions },
  } }) => ({
    questions,
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
