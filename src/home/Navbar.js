import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdHistory } from 'react-icons/md';
import { GoHome } from 'react-icons/go';
import { IoMdTime } from 'react-icons/io';
import { AiOutlineLike } from 'react-icons/ai';
import { ContentPolicy, PrivacyPolicy, UserAgreement } from '../assets/css/icons';
import { MenuNavContainer } from '../components/Containers';
import { AUTHORIZED } from 'loony-types';
import { axiosInstance } from 'loony-query';

const Followed = ({ auth }) => {
  const [canFollowTags, setCanFollowTags] = useState(null);

  useEffect(() => {
    if (auth.status === AUTHORIZED) {
      axiosInstance
        .get(`/tag/${auth.user.uid}/get_all_tags_user_can_follow`)
        .then(({ data }) => {
          setCanFollowTags(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const user_removed_a_followed_tag = (tag_id) => {
    axiosInstance.post(`/tag/user_removed_a_followed_tag`, { tag_id, user_id: auth.user.uid });
  };
  return (
    <div>
      <div>Recommendations</div>
      {canFollowTags &&
        canFollowTags.map((tag) => {
          return (
            <MenuNavContainer key={tag.uid}>
              <span
                style={{
                  marginRight: 10,
                  backgroundColor: '#ccc',
                  width: 35,
                  height: 30,
                  borderRadius: 30,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {tag.name.substr(0, 1)}
              </span>
              <div className='page-nav-title'>
                <span>{tag.name}</span>
                <button
                  onClick={() => {
                    user_removed_a_followed_tag(tag.uid);
                  }}
                  style={{ marginLeft: 10 }}
                >
                  Remove
                </button>
              </div>
            </MenuNavContainer>
          );
        })}
    </div>
  );
};

const Recommended = ({ auth }) => {
  const [followedTags, setFollowedTags] = useState(null);

  useEffect(() => {
    if (auth.status === AUTHORIZED) {
      axiosInstance
        .get(`/tag/${auth.user.uid}/get_all_tags_user_has_followed`)
        .then(({ data }) => {
          setFollowedTags(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const user_removed_a_followed_tag = (tag_id) => {
    axiosInstance.post(`/tag/user_removed_a_followed_tag`, { tag_id, user_id: auth.user.uid });
  };
  return (
    <div>
      <div>Followed</div>
      {followedTags &&
        followedTags.map((tag) => {
          return (
            <MenuNavContainer key={tag.uid}>
              <span
                style={{
                  marginRight: 10,
                  backgroundColor: '#ccc',
                  width: 35,
                  height: 30,
                  borderRadius: 30,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {tag.name.substr(0, 1)}
              </span>
              <div className='page-nav-title'>
                <span>{tag.name}</span>
                <button
                  onClick={() => {
                    user_removed_a_followed_tag(tag.uid);
                  }}
                >
                  Remove
                </button>
              </div>
            </MenuNavContainer>
          );
        })}
    </div>
  );
};

export default function Navbar({ auth }) {
  return (
    <div style={{ width: '15%', paddingTop: 10 }}>
      <div style={{ width: '90%', paddingLeft: '5%', paddingRight: '5%' }}>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <GoHome size={20} color='#2d2d2d' />
          </span>
          <div className='page-nav-title'>Home</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <MdHistory size={20} color='#2d2d2d' />
          </span>
          <div className='page-nav-title'>History</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <IoMdTime size={20} color='#2d2d2d' />
          </span>
          <div className='page-nav-title'>Read Later</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <AiOutlineLike size={20} color='#2d2d2d' />
          </span>
          <div className='page-nav-title'>Likes</div>
        </MenuNavContainer>
        {auth.status === AUTHORIZED ? (
          <>
            <hr />
            <Followed auth={auth} />
          </>
        ) : null}
        {auth.status === AUTHORIZED ? (
          <>
            <hr />
            <Recommended auth={auth} />
          </>
        ) : null}
        <hr />
        <MenuNavContainer>
          <span
            style={{
              marginRight: 10,
              height: 16,
              width: 16,
            }}
          >
            <ContentPolicy />
          </span>
          <div className='page-nav-title'>
            <Link to={`/policies/ContentPolicy`}>Content Policy</Link>
          </div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
            <PrivacyPolicy />
          </span>
          <div className='page-nav-title'>
            <Link to={`/policies/PrivacyPolicy`}>Privacy Policy</Link>
          </div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
            <UserAgreement />
          </span>
          <div className='page-nav-title'>
            <Link to={`/policies/UserAgreement`}>User Agreement</Link>
          </div>
        </MenuNavContainer>
      </div>
    </div>
  );
}
