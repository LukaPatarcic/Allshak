import React from "react";
import {MDBBadge, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon, MDBTooltip} from "mdbreact";
import {Link} from "react-router-dom";

export default class Following extends React.Component{
    render() {
        const {following} = this.props;
        return (
            <MDBCard>
                <MDBCardHeader className={'text-center'}>
                    Following
                </MDBCardHeader>
                <MDBCardBody>
                    {following.length
                        ?
                        following.map((follower,index) => (
                                <div key={index}>
                                    <MDBBadge color="red" className={'mr-3'}>
                                        <MDBIcon className={'text-white'} icon={'user'} />
                                    </MDBBadge>
                                    <MDBTooltip>
                                        <Link className={'text-muted'} to={'/profile/'+follower.profileName}>{follower.firstName} {follower.lastName}</Link>
                                        <div>{follower.profileName}</div>
                                    </MDBTooltip>
                                </div>
                            )
                        )
                        :
                        <p className={'text-center'}>Not following anyone...</p>
                    }
                </MDBCardBody>
            </MDBCard>
        );
    }
}