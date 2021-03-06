import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList, ToastAndroid, SafeAreaView,
} from 'react-native';
import { Text } from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";
import {Avatar, Card, FAB, IconButton, Paragraph} from 'react-native-paper';
import PostItem from "../components/PostItem";
import {BASE_URL} from "../config";
import {AuthContext} from "../context/AuthProvider";
import ProfilePicture from "../components/ProfilePicture";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            user: {},
            posts: [],
            following: [],
            followers: [],
            token: null,
            loadingPosts: false,
            redirect: false,
            loading: false,
            logout: false,
            refreshing: false,
            hasMore: true,
            loadingMore: false,
            offset: 0,
        }

        this.getUserData = this.getUserData.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('access-token', (err, val) => {
            this.setState({token: val},() => {
                this.getUserData();
            });
        });

        AsyncStorage.getItem("id",(err,val) => {
            this.setState({id: val})
        })
    }

    handleRefresh() {
        this.getUserData();
        this.getPostsData();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props.route.params !== nextProps.route.params) {
            this.getUserData();
            this.getPostsData();
        }
        return true;
    }

    getUserData() {
        this.setState({loading: true});
        const params = this.props.route.params ?? null;
        const url = params ? BASE_URL+'/user?profileName='+params.profileName : BASE_URL+'/user';
        fetch(url,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.state.token
            },
            method: "GET"
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({user: data});
                this.getPostsData();
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
            .finally(() => {
                this.setState((prevState) => ({
                    loading: false,
                    loadingMore: false,
                }))
            })
   }

   getPostsData(more = false) {
       const {offset,refreshing,loadingMore,hasMore,token} = this.state;
       const params = this.props.route.params.profileName ? this.props.route.params.profileName : 'me';
       if(loadingMore || !hasMore)
           return;
       if(more) {
           this.setState({loadingMore: true})
       } else {
           this.setState({loadingPosts: true})
       }
       fetch(BASE_URL+'/post?offset='+offset+'&profile='+params,{
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Authorization': 'Bearer '+ token
           },
           method: "GET"
       })
           .then((response => response.json()))
           .then((data => {
               if(refreshing) {
                   this.setState({posts: []});
                   this.setState({posts: data})
               } else {
                   this.setState((prevState) => ({ posts: [...prevState.posts,...data]}))
               }
               this.setState((prevState) => ({
                   loading: false,
                   loadingMore: false,
                   offset: prevState.offset + 10,
                   hasMore: !!data.length,
                   refreshing: false
               }));
           }))
           .catch(err => {
               this.setState({error: true,loading: false});
           })
           .finally(() => {
               this.setState({loadingPosts: false})
           })
   }

   logout() {
        this.setState({logoutLoading: true})
       AsyncStorage.getItem('notification-key', (err, val) => {
           if (!val) {
               AsyncStorage.removeItem('access-token');
               this.setState({logoutLoading:false})
               this.context.setIsAuth();
           } else {
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
                       this.setState({logoutLoading:false})
                       AsyncStorage.removeItem('access-token');
                       AsyncStorage.removeItem('notification-key');
                       this.context.setIsAuth();
                   }))
                   .catch(err => {
                       this.setState({error: true,logoutLoading: false});
                   })
           }
       });
   }

    deletePost(id) {
        fetch(BASE_URL+'/post/'+id,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.state.token
            },
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                ToastAndroid.show('Post deleted successfully',ToastAndroid.SHORT);
                this.setState((prevState) => ({posts: prevState.posts.filter(post => post.id !== id)}));
            })
            .catch(err => {
                ToastAndroid.show('Oops... Something went wrong!',ToastAndroid.SHORT);
            })
    }

   static contextType = AuthContext

    render() {
        const {user,posts,refreshing,loading,hasMore,loadingMore,logoutLoading,id,loadingPosts} = this.state;
        const {profileName} = this.props.route.params;
        const isMe = user.id == id;

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
                <SafeAreaView>
                    <FlatList
                        style={{width: '100%',height: '100%'}}
                        refreshing={refreshing}
                        onRefresh={() => this.handleRefresh()}
                        ListHeaderComponent={() => (
                            <>
                            <Card style={{marginVertical: 30,fontFamily: 'font'}}>
                                <Card.Title
                                    subtitleStyle={{fontFamily: 'font'}}
                                    titleStyle={{fontFamily: 'font'}}
                                    title={user.profileName}
                                    subtitle={user.firstName + " " + user.lastName}
                                    left={(props) => <ProfilePicture user={user} token={this.state.token} isMe={isMe} />}
                                    right={() =>
                                        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'center',alignItems: 'center',marginRight: 30}}>
                                            <View style={{marginRight: 10}}>
                                                <TouchableOpacity
                                                    style={{padding: 2}}
                                                    onPress={() => this.props.navigation.navigate("Follow",{following: false,id: user.id})}
                                                >
                                                    <Text style={{textAlign: 'center',fontFamily: 'font'}}>Followers</Text><Text style={{textAlign: 'center',fontFamily: 'font'}}>{user.followers}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View>
                                                <TouchableOpacity
                                                    style={{padding: 2}}
                                                    onPress={() => this.props.navigation.navigate("Follow",{following: true,id: user.id})}
                                                >
                                                    <Text style={{textAlign: 'center',fontFamily: 'font'}}>Following</Text><Text style={{textAlign: 'center',fontFamily: 'font'}}>{user.following}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
                                />
                                <Card.Content>
                                    {isMe &&
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{backgroundColor: '#f00',padding: 8,width: 100, alignItems: 'center'}}
                                            onPress={this.logout.bind(this)}
                                        >
                                            {logoutLoading
                                                ?
                                                <ActivityIndicator color={'white'} size={20} />
                                                :
                                                <Text style={{fontFamily: 'font', color: '#fff', fontSize: 13}}>Logout</Text>
                                            }
                                        </TouchableOpacity>
                                    }
                                </Card.Content>
                            </Card>
                            <Card style={{marginBottom: 30}}>
                            <Card.Title titleStyle={{fontFamily: 'font'}} title={'Posts'}/>
                            </Card>
                            </>
                        )}
                        data={posts}
                        ListEmptyComponent={
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',marginTop: 100}}>
                                {loadingPosts ? <ActivityIndicator color={'red'} size={40} />
                                : <Text style={{fontFamily: 'font',fontSize: 20,color: 'white'}}>No posts found...</Text>
                                }
                            </View>
                        }
                        onEndReachedThreshold={0.6}
                        ListFooterComponent={hasMore ?
                            loadingMore ? <ActivityIndicator size={60} color={'red'} /> : null
                            :
                            <Text style={{textAlign: 'center',fontFamily: 'font',fontSize: 16,color: '#fff'}}>No more posts...</Text>}
                        onEndReached={() => this.getPostsData(true)}
                        keyExtractor={(contact, index) => String(index)}
                        renderItem={({item}) => (
                            <PostItem onDeletePost={this.deletePost} navigation={this.props.navigation} post={item} id={id} />
                        )}
                    />
                <FAB
                    style={{
                        position: 'absolute',
                        backgroundColor: 'grey',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                    }}
                    icon="pencil"
                    color={'white'}
                    onPress={() => this.props.navigation.navigate('Post')}
                />
                </SafeAreaView>
            </ImageBackground>
        );
    }
}