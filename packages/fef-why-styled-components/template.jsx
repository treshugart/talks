<style>
  body {
    color: #333;
    font-family: Helvetica;
    margin: 0;
    padding: 0;
  }
</style>
<sk-deck>
  <sk-slide>
    # Styled components

    Trey Shugart (<a href="https://twitter.com/treshugart">@treshugart</a>)
  </sk-slide>
  <sk-slide>
    # What

    ```js
    import styled from 'styled-components';
    import { render } from 'react-dom';

    const Code = styled.code`
      border-radius: 3px;
      background-color: #eee;
      color: ${props => props.color};
      display: inline-block;
      padding: 5px;
    `;

    render(
      <Code>console.log('Hello, World!');</Code>,
      document.getElementById('root')
    );
    ```
  </sk-slide>
  <sk-slide>
    # Why

    It shortcuts what most CSS in JS libs do:

    - It defines your styles
    - Mounts it to the `head`
    - Creates a unique class name
    - Creates a component that renders an element with the unique class name
    - Passes down all props

    ## Styled components

    ```js
    import styled from 'styled-components';

    export default styled.div`
      padding: 5px;
    `;
    ```

    ## JSS

    ```js
    import jss from 'jss';
    import React, { PureComponent } from 'react';

    const styles = {
      div: {
        padding: 5
      }
    };
    const { classes } = jss.createStyleSheet(styles).attach();

    export default class extends PureComponent {
      render () {
        return (
          const { props } = this;
          <div
            {...props}
            className={classes.div}
          >{props.children}</div>
        );
      }
    }
    ```
  </sk-slide>
  <sk-slide>
    # More why

    ## Pros

    - Large community
    - Simplicity
    - Other products want to use it (JIRA, BitBucket, Confluence??)
    - Idea is portable to other front-end tech stacks

    ## Cons

    - Size (~70k min)
  </sk-slide>
  <sk-slide>
    # Thanks!

    Decision matrix: https://extranet.atlassian.com/display/AtlasKit/Styling+React+components
  </sk-slide>
</sk-deck>
