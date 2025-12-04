"use client"

import './stylus/index.css'
import React, { Component } from 'react'
import FlipMove from 'react-flip-move'
import autosize from 'autosize'

import i18n from './i18n'
import './stylus/index.css'
import {
  queryParse,
  queryStringify,
  axiosJSON,
  axiosGithub,
  getMetaContent,
  formatErrorMsg,
  hasClassInParent
} from './util'
import Avatar from './component/avatar'
import Button from './component/button'
import Action from './component/action'
import Comment from './component/comment'
import Svg from './component/svg'
import { GT_ACCESS_TOKEN, GT_VERSION, GT_COMMENT } from './const'
import QLGetComments from './graphql/getComments'

type AnyObject = { [key: string]: any }

interface DefaultAuthor {
  avatarUrl?: string
  login?: string
  url?: string
}

interface Options {
  id?: string
  number?: number
  labels?: string[]
  title?: string
  body?: string
  language?: string
  perPage?: number
  pagerDirection?: 'last' | 'first'
  createIssueManually?: boolean
  distractionFreeMode?: boolean
  proxy?: string
  flipMoveOptions?: AnyObject
  enableHotKey?: boolean
  url?: string
  defaultAuthor?: DefaultAuthor
  updateCountCallback?: ((count: number) => void) | null
  owner?: string
  repo?: string
  clientID?: string
  clientSecret?: string
  admin?: string | string[]
}

interface State {
  user: AnyObject | null
  issue: AnyObject | null
  comments: AnyObject[]
  localComments: AnyObject[]
  comment: string
  page: number
  pagerDirection: 'last' | 'first'
  cursor: string | null
  previewHtml: string

  isNoInit: boolean
  isIniting: boolean
  isCreating: boolean
  isLoading: boolean
  isLoadMore: boolean
  isLoadOver: boolean
  isIssueCreating: boolean
  isPopupVisible: boolean
  isInputFocused: boolean
  isPreview: boolean

  isOccurError: boolean
  errorMsg: string
}

interface Props {
  options?: Partial<Options>
}

class GitalkComponent extends Component<Props, State> {
  options: Options
  i18n: AnyObject
  _accessToken?: string
  commentEL: HTMLTextAreaElement | null = null
  publicBtnEL: HTMLButtonElement | null = null

  state: State = {
    user: null,
    issue: null,
    comments: [],
    localComments: [],
    comment: '',
    page: 1,
    pagerDirection: 'last',
    cursor: null,
    previewHtml: '',

    isNoInit: false,
    isIniting: true,
    isCreating: false,
    isLoading: false,
    isLoadMore: false,
    isLoadOver: false,
    isIssueCreating: false,
    isPopupVisible: false,
    isInputFocused: false,
    isPreview: false,

    isOccurError: false,
    errorMsg: ''
  }

  constructor (props: Props) {
    super(props)
    
    const win = typeof window !== 'undefined' ? window : undefined
    const doc = typeof document !== 'undefined' ? document : undefined
    const nav = typeof navigator !== 'undefined' ? navigator : undefined

    this.options = Object.assign({}, {
      id: win ? win.location.href : '',
      number: -1,
      labels: ['Gitalk'],
      title: doc ? doc.title : '',
      body: '',
      language: (nav?. language || (nav as any)?.userLanguage) || 'en',
      perPage: 10,
      pagerDirection: 'last',
      createIssueManually: false,
      distractionFreeMode: false,
      proxy: 'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token',
      flipMoveOptions: {
        staggerDelayBy: 150,
        appearAnimation: 'accordionVertical',
        enterAnimation: 'accordionVertical',
        leaveAnimation: 'accordionVertical'
      },
      enableHotKey: true,
      url: win?.location.href || '',
      defaultAuthor: {
        avatarUrl: '//avatars1.githubusercontent.com/u/29697133?s=50',
        login: 'null',
        url: ''
      },
      updateCountCallback: null
    }, props.options)

    this.state.pagerDirection = this.options.pagerDirection as 'last' | 'first'
    if (win) {
      const storedComment = win?.localStorage.getItem(GT_COMMENT)
      if (storedComment) {
        this.state.comment = decodeURIComponent(storedComment)
        win?.localStorage.removeItem(GT_COMMENT)
      }
    }

    const query = queryParse() as Record<string, string>
    if (win && query.code) {
      const code = query.code
      delete query.code
      const replacedUrl = `${win.location.origin}${win.location.pathname}?${queryStringify(query)}${win.location.hash}`
      history.replaceState(null, '', replacedUrl)
      this.options = Object.assign({}, this.options, {
        url: replacedUrl,
        id: replacedUrl
      }, props.options)

      axiosJSON.post(this.options.proxy as string, {
        code,
        client_id: this.options.clientID,
        client_secret: this.options.clientSecret
      }).then(res => {
        if (res.data && res.data.access_token) {
          this.accessToken = res.data.access_token

          this.getInit()
            .then(() => this.setState({ isIniting: false }))
            .catch(err => {
              // eslint-disable-next-line no-console
              console.log('err:', err)
              this.setState({
                isIniting: false,
                isOccurError: true,
                errorMsg: formatErrorMsg(err)
              })
            })
        } else {
          // no access_token
          // eslint-disable-next-line no-console
          console.log('res.data err:', res.data)
          this.setState({
            isOccurError: true,
            errorMsg: formatErrorMsg(new Error('no access token'))
          })
        }
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.log('err: ', err)
        this.setState({
          isOccurError: true,
          errorMsg: formatErrorMsg(err)
        })
      })
    } else if (win) {
      this.getInit()
        .then(() => this.setState({ isIniting: false }))
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log('err:', err)
          this.setState({
            isIniting: false,
            isOccurError: true,
            errorMsg: formatErrorMsg(err)
          })
        })
    }

    this.i18n = i18n(this.options.language)
  }

  componentDidUpdate () {
    if (this.commentEL) autosize(this.commentEL)
  }

  get accessToken (): string | undefined {
    // corrected typo: use _accessToken consistently
    return this._accessToken || window.localStorage.getItem(GT_ACCESS_TOKEN) || undefined
  }
  set accessToken (token: string | undefined) {
    if (token) {
      window.localStorage.setItem(GT_ACCESS_TOKEN, token)
      this._accessToken = token
    } else {
      window.localStorage.removeItem(GT_ACCESS_TOKEN)
      this._accessToken = undefined
    }
  }

  get loginLink () {
    const githubOauthUrl = 'https://github.com/login/oauth/authorize'
    const { clientID } = this.options
    if (typeof window === 'undefined') return '#'
    const win = typeof window !== 'undefined' ? window : undefined
    const query = {
      client_id: clientID,
      redirect_uri: win?.location.href,
      scope: 'public_repo'
    } 
    return `${githubOauthUrl}?${queryStringify(query)}`
  }

  get isAdmin () {
    const { admin } = this.options
    const { user } = this.state

    return !!(user && ~([] as string[]).concat(admin || []).map((a: string) => a.toLowerCase()).indexOf((user.login || '').toLowerCase()))
  }

  getInit () {
    return this.getUserInfo().then(() => this.getIssue()).then(issue => { 
      this.getComments(issue)
    })
  }

  getUserInfo () {
    if (!this.accessToken) {
      return Promise.resolve()
    }
    return axiosGithub.get('/user', {
      headers: {
        Authorization: `token ${this.accessToken}`
      }
    }).then(res => {
      this.setState({ user: res.data })
    }).catch(() => {
      this.logout()
    })
  }

  getIssueById () {
    const { owner, repo, number, clientID, clientSecret } = this.options
    const getUrl = `/repos/${owner}/${repo}/issues/${number}`

    return new Promise<AnyObject | null>((resolve, reject) => {
      axiosGithub.get(getUrl, {
        auth: {
          username: clientID as string,
          password: clientSecret as string
        },
        params: {
          t: Date.now()
        }
      })
        .then(res => {
          let issue = null as AnyObject | null

          if (res && res.data && res.data.number === number) {
            issue = res.data

            this.setState({ issue, isNoInit: false })
          }
          resolve(issue)
        })
        .catch(err => {
          // When the status code is 404, promise will be resolved with null
          if (err.response && err.response.status === 404) resolve(null)
          else reject(err)
        })
    })
  }

  getIssueByLabels () {
    const { owner, repo, id, labels, clientID, clientSecret } = this.options

    return axiosGithub.get(`/repos/${owner}/${repo}/issues`, {
      auth: {
        username: clientID as string,
        password: clientSecret as string
      },
      params: {
        labels: (labels || []).concat(id as string).join(','),
        t: Date.now()
      }
    }).then(res => {
      const { createIssueManually } = this.options
      let isNoInit = false
      let issue: AnyObject | null = null
      if (!(res && res.data && res.data.length)) {
        if (!createIssueManually && this.isAdmin) {
          return this.createIssue()
        }

        isNoInit = true
      } else {
        issue = res.data[0]
      }
      this.setState({ issue, isNoInit })
      return issue
    })
  }

  getIssue () {
    const { number } = this.options
    const { issue } = this.state
    if (issue) {
      this.setState({ isNoInit: false })
      return Promise.resolve(issue)
    }

    if (typeof number === 'number' && number > 0) {
      return this.getIssueById().then(resIssue => {
        if (!resIssue) return this.getIssueByLabels()
        return resIssue
      })
    }
    return this.getIssueByLabels()
  }

  createIssue () {
    const { owner, repo, title, body, id, labels, url } = this.options
    return axiosGithub.post(`/repos/${owner}/${repo}/issues`, {
      title,
      labels: (labels || []).concat(id as string),
      body: body || `${url} \n\n ${
        getMetaContent('description') ||
        getMetaContent('description', 'og:description') || ''
      }`
    }, {
      headers: {
        Authorization: `token ${this.accessToken}`
      }
    }).then(res => {
      this.setState({ issue: res.data })
      return res.data
    })
  }

  // Get comments via v3 api, don't require login, but sorting feature is disable
  getCommentsV3 = (issue: AnyObject) => {
    const { clientID, clientSecret, perPage } = this.options
    const { page } = this.state

    return this.getIssue()
      .then(issue => {
        if (!issue) return

        return axiosGithub.get(issue.comments_url, {
          headers: {
            Accept: 'application/vnd.github.v3.full+json'
          },
          auth: {
            username: clientID as string,
            password: clientSecret as string
          },
          params: {
            per_page: perPage,
            page
          }
        }).then(res => {
          const { comments, issue } = this.state
          let isLoadOver = false
          const cs = comments.concat(res.data)
          if (cs.length >= (issue && issue.comments) || res.data.length < (perPage || 10)) {
            isLoadOver = true
          }
          this.setState({
            comments: cs,
            isLoadOver,
            page: page + 1
          })
          return cs
        })
      })
  }

  getComments (issue?: AnyObject) {
    if (!issue) return Promise.resolve()
    // Get comments via v4 graphql api, login required and sorting feature is available
    if (this.accessToken) return QLGetComments.call(this, issue)
    return this.getCommentsV3(issue)
  }

  createComment () {
    const { comment, localComments, comments } = this.state

    return this.getIssue()
      .then(issue => axiosGithub.post(issue.comments_url, {
        body: comment
      }, {
        headers: {
          Accept: 'application/vnd.github.v3.full+json',
          Authorization: `token ${this.accessToken}`
        }
      }))
      .then(res => {
        this.setState({
          comment: '',
          comments: comments.concat(res.data),
          localComments: localComments.concat(res.data)
        })
      })
  }

  logout () {
    this.setState({ user: null })
    window.localStorage.removeItem(GT_ACCESS_TOKEN)
    this._accessToken = undefined
  }

  getRef = (e: HTMLButtonElement | null) => {
    this.publicBtnEL = e
  }

  reply = (replyComment: AnyObject) => () => {
    const { comment } = this.state
    const replyCommentBody = replyComment.body as string
    let replyCommentArray = replyCommentBody.split('\n')
    replyCommentArray.unshift(`@${replyComment.user.login}`)
    replyCommentArray = replyCommentArray.map((t: string) => `> ${t}`)
    replyCommentArray.push('')
    replyCommentArray.push('')
    if (comment) replyCommentArray.unshift('')
    this.setState({ comment: comment + replyCommentArray.join('\n') }, () => {
      if (this.commentEL) {
        autosize.update(this.commentEL)
        this.commentEL.focus()
      }
    })
  }

  like (comment: AnyObject) {
    const { owner, repo } = this.options
    const { user } = this.state
    let { comments } = this.state

    axiosGithub.post(`/repos/${owner}/${repo}/issues/comments/${comment.id}/reactions`, {
      content: 'heart'
    }, {
      headers: {
        Authorization: `token ${this.accessToken}`,
        Accept: 'application/vnd.github.squirrel-girl-preview'
      }
    }).then(res => {
      comments = comments.map(c => {
        if (c.id === comment.id) {
          if (c.reactions) {
            if (user && !~c.reactions.nodes.findIndex((n: AnyObject) => n.user.login === user.login)) {
              c.reactions.totalCount += 1
            }
          } else {
            c.reactions = { nodes: [] }
            c.reactions.totalCount = 1
          }

          c.reactions.nodes.push(res.data)
          c.reactions.viewerHasReacted = true
          return Object.assign({}, c)
        }
        return c
      })

      this.setState({
        comments
      })
    })
  }

  unLike (comment: AnyObject) {
    const { user } = this.state
    let { comments } = this.state

    const getQL = (id: string) => ({
      operationName: 'RemoveReaction',
      query: `
          mutation RemoveReaction{
            removeReaction (input:{
              subjectId: "${id}",
              content: HEART
            }) {
              reaction {
                content
              }
            }
          }
        `
    })

    axiosGithub.post('/graphql', getQL(comment.gId), {
      headers: {
        Authorization: `bearer ${this.accessToken}`
      }
    }).then(res => {
      if (res.data) {
        comments = comments.map(c => {
          if (c.id === comment.id) {
            const index = user ? c.reactions.nodes.findIndex((n: AnyObject) => n.user.login === user.login) : -1
            if (~index) {
              c.reactions.totalCount -= 1
              c.reactions.nodes.splice(index, 1)
            }
            c.reactions.viewerHasReacted = false
            return Object.assign({}, c)
          }
          return c
        })

        this.setState({
          comments
        })
      }
    })
  }

  handlePopup = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isVisible = !this.state.isPopupVisible
    const hideHandle = (e1: MouseEvent) => {
      if (hasClassInParent((e1.target as Element), 'gt-user', 'gt-popup')) {
        return
      }
      window.document.removeEventListener('click', hideHandle)
      this.setState({ isPopupVisible: false })
    }
    this.setState({ isPopupVisible: isVisible })
    if (isVisible) {
      window.document.addEventListener('click', hideHandle)
    } else {
      window.document.removeEventListener('click', hideHandle)
    }
  }

  handleLogin = () => {
    const { comment } = this.state
    window.localStorage.setItem(GT_COMMENT, encodeURIComponent(comment))
    window.location.href = this.loginLink
  }

  handleIssueCreate = () => {
    this.setState({ isIssueCreating: true })
    this.createIssue().then(issue => {
      this.setState({
        isIssueCreating: false,
        isOccurError: false
      })
      this.getComments(issue)
    }).catch(err => {
      this.setState({
        isIssueCreating: false,
        isOccurError: true,
        errorMsg: formatErrorMsg(err)
      })
    }).then(() => {
      this.setState({
        isNoInit: false
      })
    })
  }

  handleCommentCreate = (e?: React.SyntheticEvent) => {
    if (!this.state.comment.length) {
      e && e.preventDefault()
      if (this.commentEL) this.commentEL.focus()
      return
    }
    this.setState(state => {
      if (state.isCreating) return null as any

      this.createComment()
        .then(() => this.setState({
          isCreating: false,
          isOccurError: false
        }))
        .catch(err => {
          this.setState({
            isCreating: false,
            isOccurError: true,
            errorMsg: formatErrorMsg(err)
          })
        })
      return { isCreating: true } as Pick<State, 'isCreating'>
    })
  }

  handleCommentPreview = (e?: React.SyntheticEvent) => {
    this.setState({
      isPreview: !this.state.isPreview
    })
    if (!this.state.isPreview) {
      return
    }
    axiosGithub.post('/markdown', {
      text: this.state.comment
    }, {
      headers: this.accessToken ? { Authorization: `token ${this.accessToken}` } : undefined
    }).then(res => {
      this.setState({
        previewHtml: res.data
      })
    }).catch(err => {
      this.setState({
        isOccurError: true,
        errorMsg: formatErrorMsg(err)
      })
    })
  }

  handleCommentLoad = () => {
    const { issue, isLoadMore } = this.state
    if (isLoadMore) return
    this.setState({ isLoadMore: true })
    this.getComments(issue || undefined).then(() => this.setState({ isLoadMore: false }))
  }

  handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({ comment: e.target.value })
  handleLogout = () => {
    this.logout()
    window.location.reload()
  }
  handleCommentFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const { distractionFreeMode } = this.options
    if (!distractionFreeMode) return e.preventDefault()
    this.setState({ isInputFocused: true })
  }
  handleCommentBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const { distractionFreeMode } = this.options
    if (!distractionFreeMode) return e.preventDefault()
    this.setState({ isInputFocused: false })
  }
  handleSort = (direction: 'last' | 'first') => (e?: React.SyntheticEvent) => {
    this.setState({ pagerDirection: direction })
  }
  handleCommentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { enableHotKey } = this.options
    if (enableHotKey && (e.metaKey || (e as any).ctrlKey) && e.keyCode === 13) {
      this.publicBtnEL && this.publicBtnEL.focus()
      this.handleCommentCreate()
    }
  }

  initing () {
    return <div className="gt-initing">
      <i className="gt-loader"/>
      <p className="gt-initing-text">{this.i18n.t('init')}</p>
    </div>
  }

  noInit () {
    const { user, isIssueCreating } = this.state
    const { owner, repo, admin } = this.options
    return (
      <div className="gt-no-init" key="no-init">
        <p dangerouslySetInnerHTML={{
          __html: this.i18n.t('no-found-related', {
            link: `<a href="https://github.com/${owner}/${repo}/issues">Issues</a>`
          })
        }}/>
        <p>{this.i18n.t('please-contact', { user: ([] as string[]).concat(admin || []).map((u: string) => `@${u}`).join(' ') })}</p>
        {this.isAdmin ? <p>
          <Button className="" getRef={undefined} onClick={this.handleIssueCreate} onMouseDown={undefined} isLoading={isIssueCreating} text={this.i18n.t('init-issue')} />
        </p> : null}
        {!user && <Button className="gt-btn-login" getRef={undefined} onClick={this.handleLogin} onMouseDown={undefined} text={this.i18n.t('login-with-github')} isLoading={false} />}
      </div>
    )
  }

  header () {
    const { user, comment, isCreating, previewHtml, isPreview } = this.state
    return (
      <div className="gt-header" key="header">
        {user ?
          <Avatar className="gt-header-avatar" src={user.avatar_url} alt={user.login} /> :
          <a className="gt-avatar-github" onClick={this.handleLogin}>
            <Svg className="gt-ico-github" name="github" text=""/>
          </a>
        }
        <div className="gt-header-comment">
          <textarea
            ref={t => { this.commentEL = t }}
            className={`gt-header-textarea ${isPreview ? 'hide' : ''}`}
            value={comment}
            onChange={this.handleCommentChange}
            onFocus={this.handleCommentFocus}
            onBlur={this.handleCommentBlur}
            onKeyDown={this.handleCommentKeyDown}
            placeholder={this.i18n.t('leave-a-comment')}
          />
          <div
            className={`gt-header-preview markdown-body ${isPreview ? '' : 'hide'}`}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
          <div className="gt-header-controls">
            <a className="gt-header-controls-tip" href="https://guides.github.com/features/mastering-markdown/" target="_blank" rel="noopener noreferrer">
              <Svg className="gt-ico-tip" name="tip" text={this.i18n.t('support-markdown')}/>
            </a>
            {user && <Button
              getRef={this.getRef}
              className="gt-btn-public"
              onClick={this.handleCommentCreate}
              onMouseDown={undefined}
              text={this.i18n.t('comment')}
              isLoading={isCreating}
            />}

            <Button
              className="gt-btn-preview"
              getRef={undefined}
              onClick={this.handleCommentPreview}
              onMouseDown={undefined}
              text={isPreview ? this.i18n.t('edit') : this.i18n.t('preview')}
              isLoading={false}
            />
            {!user && <Button className="gt-btn-login" getRef={undefined} onClick={this.handleLogin} onMouseDown={undefined} text={this.i18n.t('login-with-github')} isLoading={false} />}
          </div>
        </div>
      </div>
    )
  }

  comments () {
    const { user, comments, isLoadOver, isLoadMore, pagerDirection } = this.state
    const { language, flipMoveOptions, admin } = this.options
    const totalComments = comments.concat([])
    if (pagerDirection === 'last' && this.accessToken) {
      totalComments.reverse()
    }
    return (
      <div className="gt-comments" key="comments">
        <FlipMove {...flipMoveOptions}>
          {totalComments.map(c => (
            <Comment
              comment={c}
              key={c.id}
              user={user}
              language={language}
              commentedText={this.i18n.t('commented')}
              admin={admin}
              replyCallback={this.reply(c)}
              likeCallback={c.reactions && c.reactions.viewerHasReacted ? this.unLike.bind(this, c) : this.like.bind(this, c)}
            />
          ))}
        </FlipMove>
        {!totalComments.length && <p className="gt-comments-null">{this.i18n.t('first-comment-person')}</p>}
        {(!isLoadOver && totalComments.length) ? <div className="gt-comments-controls">
          <Button className="gt-btn-loadmore" getRef={undefined} onClick={this.handleCommentLoad} onMouseDown={undefined} isLoading={isLoadMore} text={this.i18n.t('load-more')} />
        </div> : null}
      </div>
    )
  }

  meta () {
    const { user, issue, isPopupVisible, pagerDirection, localComments } = this.state
    const cnt = (issue && issue.comments) + localComments.length
    const isDesc = pagerDirection === 'last'
    const { updateCountCallback } = this.options

    if (
      updateCountCallback &&
      {}.toString.call(updateCountCallback) === '[object Function]'
    ) {
      try {
        updateCountCallback(cnt)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('An error occurred executing the updateCountCallback:', err)
      }
    }

    return (
      <div className="gt-meta" key="meta" >
        <span className="gt-counts" dangerouslySetInnerHTML={{
          __html: this.i18n.t('counts', {
            counts: `<a class="gt-link gt-link-counts" href="${issue && issue.html_url}" target="_blank" rel="noopener noreferrer">${cnt}</a>`,
            smart_count: cnt
          })
        }}/>
        {isPopupVisible &&
          <div className="gt-popup">
            {user ? <Action className={`gt-action-sortasc${!isDesc ? ' is--active' : ''}`} onClick={this.handleSort('first')} text={this.i18n.t('sort-asc')}/> : null }
            {user ? <Action className={`gt-action-sortdesc${isDesc ? ' is--active' : ''}`} onClick={this.handleSort('last')} text={this.i18n.t('sort-desc')}/> : null }
            {user ?
              <Action className="gt-action-logout" onClick={this.handleLogout} text={this.i18n.t('logout')}/> :
              <a className="gt-action gt-action-login" onClick={this.handleLogin}>{this.i18n.t('login-with-github')}</a>
            }
            <div className="gt-copyright">
              <a className="gt-link gt-link-project" href="https://github.com/gitalk/gitalk" target="_blank" rel="noopener noreferrer">Gitalk</a>
              <span className="gt-version">{GT_VERSION}</span>
            </div>
          </div>
        }
        <div className="gt-user">
          {user ?
            <div className={isPopupVisible ? 'gt-user-inner is--poping' : 'gt-user-inner'} onClick={this.handlePopup}>
              <span className="gt-user-name">{user.login}</span>
              <Svg className="gt-ico-arrdown" name="arrow_down" text=""/>
            </div> :
            <div className={isPopupVisible ? 'gt-user-inner is--poping' : 'gt-user-inner'} onClick={this.handlePopup}>
              <span className="gt-user-name">{this.i18n.t('anonymous')}</span>
              <Svg className="gt-ico-arrdown" name="arrow_down" text=""/>
            </div>
          }
        </div>
      </div>
    )
  }

  render () {
    const { isIniting, isNoInit, isOccurError, errorMsg, isInputFocused } = this.state
    return (
      <div className={`gt-container${isInputFocused ? ' gt-input-focused' : ''}`}>
        {isIniting && this.initing()}
        {!isIniting && (
          isNoInit ? [
          ] : [
            this.meta()
          ])
        }
        {isOccurError && <div className="gt-error">
          {errorMsg}
        </div>}
        {!isIniting && (
          isNoInit ? [
            this.noInit()
          ] : [
            this.header(),
            this.comments()
          ])
        }
      </div>
    )
  }
}

export default GitalkComponent