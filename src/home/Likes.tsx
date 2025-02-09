import { useEffect, useState } from 'react'

import { BasicMenuNavContainer } from '../components/Containers.tsx'
import { axiosInstance } from 'loony-api'
import { JsonObject, AuthContextProps, AuthStatus } from 'loony-types'

const Followed = ({ authContext }: { authContext: AuthContextProps }) => {
  const [canFollowTags, setCanFollowTags] = useState<JsonObject[]>([])

  useEffect(() => {
    if (authContext.status === AuthStatus.AUTHORIZED && authContext.user) {
      axiosInstance
        .get(`/tag/${authContext.user.uid}/get_all_tags_user_can_follow`)
        .then(({ data }: { data: JsonObject[] }) => {
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
      {Array.isArray(canFollowTags) &&
        canFollowTags.map((tag) => {
          return (
            <BasicMenuNavContainer key={`r-${tag.uid}`}>
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
    if (authContext.status === AuthStatus.AUTHORIZED && authContext.user) {
      axiosInstance
        .get(`/tag/${authContext.user.uid}/get_all_tags_user_has_followed`)
        .then(({ data }: { data: JsonObject[] }) => {
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
      {Array.isArray(followedTags) &&
        followedTags.map((tag) => {
          return (
            <BasicMenuNavContainer key={`f-${tag.uid}`}>
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
