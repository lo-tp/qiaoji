import React, { PropTypes } from 'react';
import { Container, Message, Header, Button, Form } from 'semantic-ui-react';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import './component.scss';
import { setUi } from '../../../action';

const trim = value => value && value.trim();

const loginSignupForm = ({ error, handleSubmit, removeError }) => (
  <div
    className = 'container'
  >
    <Header
      as = 'h1'
      textAlign = 'center'
    >
      巧记
    </Header>
    <Message
      hidden = { error === undefined }
      onDismiss = { removeError }

      // onDismiss = { () => {} }
      negative = { true }
      content = { error }
    />
    <Form
      onSubmit = { handleSubmit }
    >
      <Form.Field>
        <label
          htmlFor = 'userName'
        >
          Email address
        </label>
        <Field
          name = 'userName'
          component = 'input'
          type = 'text'
          normalize = { trim }
        />
      </Form.Field>
      <Form.Field>
        <label
          htmlFor = 'password'
        >
          Password
            <a
              href = 'http://www.baidu.com'
              className = 'reset'
            >
              Forgot password?
            </a>
        </label>
        <Field
          name = 'password'
          component = 'input'
          type = 'text'
          normalize = { trim }
        />
      </Form.Field>
      <Button
        type = 'submit'
        color = 'green'
        fluid = { true }
      >
        Sign in
      </Button>
    </Form>
    <Container
      textAlign = 'center'
    >
      <p >
        New to 巧记?
            <a
              href = 'http://www.baidu.com'
            >
              Create an account
            </a>
            .
      </p>
    </Container>
  </div>
);

loginSignupForm.mapStateToProps = state => ({
  error: state.ui.formError,
});
loginSignupForm.mapDispatchProps = dispatch => ({
  removeError() {
    dispatch(setUi({ formError: undefined }));
  },
});

loginSignupForm.propTypes = {
  handleSubmit: PropTypes.func,
  removeError: PropTypes.func,
  error: PropTypes.string,
};

export default connect(
  loginSignupForm.mapStateToProps,
  loginSignupForm.mapDispatchProps,
                      )(loginSignupForm);
