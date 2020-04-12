import React from 'react';
import {View, StyleSheet, ImageBackground, Alert, TouchableOpacity, ScrollView, ActivityIndicator,} from 'react-native';
import { Text } from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";
// import FacebookLogin from "../components/FacebookLogin";
import {Avatar, Card, FAB, IconButton, Paragraph} from 'react-native-paper';
import {Button} from "react-native-elements";
import PostItem from "../components/PostItem";
import TimeAgo from "react-native-timeago";
import LikeButton from "../components/LikeButton";
import AddPost from "../components/AddPost";
import PTRViewAndroid from "react-native-pull-to-refresh/lib/PullToRefreshView.android";
import {BASE_URL} from "../config";
import {AuthContext} from "../context/AuthProvider";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {
                user: {},
                posts: [],
                following: [],
                followers: []
            },
            token: null,
            redirect: false,
            loading: false,
            logout: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                // this.props.history.push('/login');
            } else {
                this.setState({token: val});
                this.getUserData(val)
            }
        });
    }

    getUserData(token) {

        this.setState({loading: true});
        fetch(BASE_URL+'/user',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': token
            },
            method: "GET"
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({userData: data,loading: false});
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
   }

   logout() {
       AsyncStorage.getItem('notification-key', (err, val) => {
           if (!val) {
               this.setState({logout:true})
               AsyncStorage.removeItem('access-token');
               console.log('here')
           } else {
               console.log('here2')
               fetch(BASE_URL+'/logout/android',{
                   headers: {
                       'Accept': 'application/json',
                       'Content-Type': 'application/json',
                       'Authorization': 'Bearer '+ this.state.token
                   },
                   method: "POST",
                   body: JSON.stringify({phone: val})
               })
                   .then((response => response.json()))
                   .then((data => {
                       console.log(data);
                       this.setState({logout:true})
                       AsyncStorage.removeItem('access-token');
                       AsyncStorage.removeItem('notification-key');
                   }))
                   .catch(err => {
                       this.setState({error: true,loading: false});
                   })
           }
       });
   }

    render() {
        const {user,posts,followers,following} = this.state.userData;
        const {loading,logout} = this.state;

        if(loading) {
            return (
                <ImageBackground
                    style={{width: '100%', height: '100%'}}
                    source={require('../../assets/images/background-01.png')}
                >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',position: 'absolute', width: '100%', height: '100%'}}>
                        <ActivityIndicator color={'red'} size={100} />
                    </View>
                </ImageBackground>
            )
        }

        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={require('../../assets/images/background-01.png')}
            >
                <PTRViewAndroid onRefresh={() => this.getUserData(this.state.token)}>
                    <AuthContext.Consumer>
                        {(context) => {
                            if(logout) {
                                context.setIsAuth();
                            }
                        }}
                    </AuthContext.Consumer>
                    <ScrollView>
                        <Card style={{marginVertical: 30,fontFamily: 'font'}}>
                            <Card.Title subtitleStyle={{fontFamily: 'font'}} titleStyle={{fontFamily: 'font'}}  title={user.profileName} subtitle={user.firstName + " " + user.lastName} left={(props) =><Avatar.Image size={50} source={{uri: 'https://i.pinimg.com/originals/53/3c/18/533c18ff0df87fbbdf58b11e0048a199.jpg'}}/>} />
                            <Card.Content>
                                <View style={{flex: 1, flexDirection: 'row', alignContent: 'flex-start'}}>
                                    <View style={{marginRight: 10, justifyContent: 'center'}}>
                                        {/*<FacebookLogin/>*/}
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{backgroundColor: '#f00',padding: 8,width: 100, alignItems: 'center'}}
                                            onPress={this.logout.bind(this)}
                                        >
                                            <Text style={{fontFamily: 'font', color: '#fff', fontSize: 13}}>Logout</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                        <Card style={{marginVertical: 30,fontFamily: 'font'}}>
                            <Card.Title titleStyle={{fontFamily: 'font'}}  title={'Followers (' + user.followerCount +')'} />
                            <Card.Content>
                                {followers.map((follower,index) =>
                                    <View key={index} style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row',marginBottom: 5}}>
                                        <View>
                                            <Avatar.Image size={30} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+follower.firstName+'+'+follower.lastName}}/>
                                        </View>
                                        <View style={{marginTop: 7, marginLeft: 3}}>
                                            <Text style={{fontFamily: 'font',fontSize: 14}}>{follower.firstName + " " + follower.lastName} ({follower.profileName})</Text>
                                        </View>
                                    </View>
                                )}
                            </Card.Content>
                        </Card>

                        <Card style={{marginBottom: 30,fontFamily: 'font'}}>
                            <Card.Title titleStyle={{fontFamily: 'font'}}  title={'Following (' + user.followingCount +')'} />
                            <Card.Content>
                                {following.map((follower,index) =>
                                    <View key={index} style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row', marginBottom: 5}}>
                                        <View>
                                            <Avatar.Image size={30} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+follower.firstName+'+'+follower.lastName}}/>
                                        </View>
                                        <View style={{marginTop: 7, marginLeft: 3}}>
                                            <Text style={{fontFamily: 'font',fontSize: 14}}>{follower.firstName + " " + follower.lastName} ({follower.profileName})</Text>
                                        </View>
                                    </View>
                                )}
                            </Card.Content>
                        </Card>
                        <View>
                            <Card style={{marginBottom: 30}}>
                                <Card.Title titleStyle={{fontFamily: 'font'}} title={'Posts'}/>
                            </Card>
                            {posts.map((post,index) => (
                                <PostItem post={post} key={index} />
                            ))}
                        </View>
                    </ScrollView>
                </PTRViewAndroid>
                <FAB
                    style={styles.fab}
                    icon="pencil"
                    color={'white'}
                    onPress={() => this.props.navigation.navigate('Post')}
                />
            </ImageBackground>
        );
    }
}
