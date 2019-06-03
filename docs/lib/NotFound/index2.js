import React from 'react';
import { browserHistory } from 'react-router';
import Common from '../../public/script/common'
let IndexPage = React.createClass({
  getInitialState: function () {
    console.log(1);
    let path = '';
    let loading = false;
    let loc = this.props.location;
    if (loc !== null && typeof (loc) !== 'undefined') {
      path = loc.pathname;
      if (path !== null && typeof (path) !== 'undefined') {
        if(path.startsWith('/wisdomPark/')){
          loading = true;
          let pathname = this.props.location.pathname;
          if(pathname.indexOf('href')>-1){
            pathname = '/'+search.split('=')[1];//对应404页面的href
          }
          pathname = pathname.substring(0,pathname.lastIndexOf('/')+1);
          debugger
          console.log(Common.getMenuList());
          // document.location.href = '/wisdomPark.html?'+pathname;
        }
      }
    }
    
    return {
      loading: loading,
      path: path,
    };
  },
  
  render: function () {
    if (this.state.loading) {
      return (
			  <div id="app" style={{width:'100%', height:'100%'}}>
                {/*<div style={{paddingTop:'100px',width:'300px',margin:'0 auto'}}>正在加载，请等待....</div>*/}
			  </div>
      );
    }
    
    return (
			<div>
				<h1>404 - Not Found {this.state.path}</h1>
			</div>
    );
  }
});

module.exports = IndexPage;
