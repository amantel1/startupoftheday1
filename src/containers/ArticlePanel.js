import React, {Component} from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {connect} from 'react-redux';
import * as startupSelectors from '../store/startup/reducer';
import {goBack} from 'react-router-redux';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Share from '@vkontakte/icons/dist/24/share';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import './StartupDashboard.css';
import * as VKConnect from '@vkontakte/vkui-connect';

class ArticlePanel extends Component {



    getPrettyDate(dateString) {
        let date = new Date(dateString);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        return ('0' + day).slice(-2) + '.' + ('0' + (month + 1)).slice(-2) + '.' + year.toString().substr(-2);
    }



        render() {
        const osname = UI.platform();


            document.querySelector('body').scrollIntoView({ block: 'start', behavior: 'smooth' });

            if (!this.props.selectedArticle) {
                return (
                  <UI.Panel id={this.props.id}>
                    <UI.PanelHeader
                        left={<UI.HeaderButton onClick={this.navigationBack.bind(this)}>{osname === UI.IOS ?
                            <Icon28ChevronBack/> : <Icon24Back/>}</UI.HeaderButton>}
                    >
                        Статья
                    </UI.PanelHeader>


                    <UI.Group title="Нет статьи">
                    </UI.Group>
                  </UI.Panel>
                );
            }

            let article = this.props.selectedArticle;

            let isFav = false;
            if(this.props.user && this.props.user.favorites.indexOf(article.guid)!==-1) {
              isFav = true;
            }


            let date = this.getPrettyDate(article.isoDate);
            let title = "Выпуск от "+date;
            if(this.props.fromMemory) {
              title = title + " < FROM LOCAL STORAGE >";
            }
            //
            //maybe we should use https://stackoverflow.com/a/47159227/2863227



            let content = article.content;
            return (
              <UI.Panel id={this.props.id}>
                <UI.PanelHeader
                    left={<UI.HeaderButton onClick={this.navigationBack.bind(this)}>{osname === UI.IOS ?
                        <Icon28ChevronBack/> : <Icon24Back/>}</UI.HeaderButton>}
                >
                    Статья
                </UI.PanelHeader>
              <UI.Group title={title}>



                <UI.Div>


                    <UI.Div className="startup_article_content_div">
                      <div  dangerouslySetInnerHTML={{ __html: content }} />
                    </UI.Div>

                    <UI.Div style={{display: 'flex'}}>
                          <UI.Button level="1" before={<Icon24Favorite/>} disabled={isFav}
                           stretched className="other_buttons"
                          onClick={this.saveToFavorites.bind(this,article.guid)}
                          >    Добавить в избранное</UI.Button>
                          <UI.Button level="1" before={<Icon24Share/>} stretched className="other_buttons"
                           onClick={this.goShare.bind(this)}>
                          Отправить другу</UI.Button>
                    </UI.Div>

                </UI.Div>

              </UI.Group>
                  </UI.Panel>
            );
      }

      navigationBack() {
          this.props.dispatch(goBack());
      }
      goShare() {
          let article = this.props.currArticle;
          VKConnect.send("VKWebAppShare", {"link":article.guid});
      }
      saveToFavorites(guid) {
        this.props.dispatch({ type: 'SAVE_TO_FAVORITES', guid:this.props.currArticle.guid});
      }
}

function mapStateToProps(state) {
    return {
      selectedArticle: startupSelectors.getSelectedArticle(state),
      user:startupSelectors.getUser(state),
    };
}


export default connect(mapStateToProps)(ArticlePanel);