import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24Notification from '@vkontakte/icons/dist/24/notification';
import Icon24NotificationDisable from '@vkontakte/icons/dist/24/notification_disable';
import Icon24User from '@vkontakte/icons/dist/24/user';
import StartupDashboard from './StartupDashboard';
import * as vkSelectors from '../store/vk/reducer';
import * as vkActions from '../store/vk/actions';
import * as startupSelectors from '../store/startup/reducer';

class MainPanel extends Component {

    componentWillMount() {


    }

    componentDidUpdate() {
        if (this.props.accessToken) {
            this.props.dispatch(vkActions.fetchNotificationStatus(this.props.accessToken));
        }
    }

    render() {


        return (
                  <StartupDashboard id={this.props.id}/>

        );
    }

    renderNotificationButton() {
        const {notificationStatus} = this.props;
        if (!this.props.accessToken || notificationStatus === undefined) {
            return (<UI.Div>
                <UI.Button
                    before={<Icon24User/>}
                    level='1'
                    size="xl"
                    onClick={this.authorize.bind(this)}
                >Авторизоваться</UI.Button>
            </UI.Div>);
        }

        return (<UI.Div>
            <UI.Button
                before={notificationStatus ? <Icon24NotificationDisable/> : <Icon24Notification/>}
                level={notificationStatus ? '2' : '1'}
                size="xl"
                onClick={this.toggleNotifications.bind(this)}
            >{notificationStatus ? 'Отписаться' : 'Подписаться'}</UI.Button>
        </UI.Div>);
    }


    authorize() {
        this.props.dispatch(vkActions.fetchAccessToken());
    }


    toggleNotifications() {
        const {notificationStatus} = this.props;

        if (notificationStatus) {
            this.props.dispatch(vkActions.denyNotifications());
        } else {
            this.props.dispatch(vkActions.allowNotifications());
        }
    }
}

function mapStateToProps(state) {
    return {
        notificationStatus: vkSelectors.getNotificationStatus(state),
        articles: startupSelectors.getArticlesContent(state),
    };
}

export default connect(mapStateToProps)(MainPanel);
