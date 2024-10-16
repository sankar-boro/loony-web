import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdHistory } from 'react-icons/md'
import { GoHome } from 'react-icons/go'
import { IoMdTime } from 'react-icons/io'
import { AiOutlineLike } from 'react-icons/ai'
import contentPolicy from '../assets/svgs/ContentPolicy.svg'
import privacyPolicy from '../assets/svgs/PrivacyPolicy.svg'
import userAgreement from '../assets/svgs/UserAgreement.svg'

import { BasicMenuNavContainer } from '../components/Containers.tsx'
import { AUTHORIZED } from 'loony-types'
import { axiosInstance } from 'loony-query'
import { JsonObject, AuthContextProps } from 'types/index.ts'

const Followed = ({ authContext }: { authContext: AuthContextProps }) => {
  const [canFollowTags, setCanFollowTags] = useState<JsonObject[]>([])

  useEffect(() => {
    if (authContext.status === AUTHORIZED && authContext.user) {
      axiosInstance
        .get(`/tag/${authContext.user.uid}/get_all_tags_user_can_follow`)
        .then(({ data }) => {
          setCanFollowTags(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])
  const user_removed_a_followed_tag = (tag_id: number) => {
    axiosInstance.post(`/tag/user_removed_a_followed_tag`, {
      tag_id,
      user_id: authContext.user && authContext.user.uid,
    })
  }

  return (
    <div>
      <div>Recommendations</div>
      {canFollowTags.map((tag) => {
        return (
          <BasicMenuNavContainer key={tag.uid}>
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
            <div className="page-nav-title">
              <span>{tag.name}</span>
              <button
                onClick={() => {
                  user_removed_a_followed_tag(tag.uid)
                }}
                style={{ marginLeft: 10 }}
              >
                Remove
              </button>
            </div>
          </BasicMenuNavContainer>
        )
      })}
    </div>
  )
}

const Recommended = ({ authContext }: { authContext: AuthContextProps }) => {
  const [followedTags, setFollowedTags] = useState<JsonObject[]>([])

  useEffect(() => {
    if (authContext.status === AUTHORIZED && authContext.user) {
      axiosInstance
        .get(`/tag/${authContext.user.uid}/get_all_tags_user_has_followed`)
        .then(({ data }) => {
          setFollowedTags(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])
  const user_removed_a_followed_tag = (tag_id: number) => {
    axiosInstance.post(`/tag/user_removed_a_followed_tag`, {
      tag_id,
      user_id: authContext.user && authContext.user.uid,
    })
  }
  return (
    <div>
      <div>Followed</div>
      {followedTags.map((tag) => {
        return (
          <BasicMenuNavContainer key={tag.uid}>
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
            <div className="page-nav-title">
              <span>{tag.name}</span>
              <button
                onClick={() => {
                  user_removed_a_followed_tag(tag.uid)
                }}
              >
                Remove
              </button>
            </div>
          </BasicMenuNavContainer>
        )
      })}
    </div>
  )
}

export default function Navbar({
  authContext,
}: {
  authContext: AuthContextProps
}) {
  return (
    <div style={{ width: '15%', paddingTop: 10 }}>
      <div style={{ width: '90%', paddingLeft: '5%', paddingRight: '5%' }}>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <GoHome size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">Home</div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <MdHistory size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">History</div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <IoMdTime size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">Read Later</div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <AiOutlineLike size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">Likes</div>
        </BasicMenuNavContainer>
        {authContext.status === AUTHORIZED ? (
          <>
            <hr />
            <Followed authContext={authContext} />
          </>
        ) : null}
        {authContext.status === AUTHORIZED ? (
          <>
            <hr />
            <Recommended authContext={authContext} />
          </>
        ) : null}
        <hr />
        <BasicMenuNavContainer>
          <span
            style={{
              marginRight: 10,
              height: 16,
              width: 16,
            }}
          >
            <img src={contentPolicy} />
          </span>
          <div className="page-nav-title">
            <Link to={`/policies/ContentPolicy`}>Content Policy</Link>
          </div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
            <img src={privacyPolicy} />
          </span>
          <div className="page-nav-title">
            <Link to={`/policies/PrivacyPolicy`}>Privacy Policy</Link>
          </div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
            <img src={userAgreement} />
          </span>
          <div className="page-nav-title">
            <Link to={`/policies/UserAgreement`}>User Agreement</Link>
          </div>
        </BasicMenuNavContainer>
      </div>
    </div>
  )
}
