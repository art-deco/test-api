import render from '@depack/render'

export {}
/**
 * @typedef {{ admin: boolean, github_token: string, linkedin_token: string } & Auth} Session
 * @typedef {import('@typedefs/goa').Context & { render: typeof render, client: elastic.Client, session: Session, mongo: mongodb.Db }} Context
 * @typedef {(ctx: Context, next: Middleware) => Promise} Middleware
 */


/* typal types/index.xml namespace */
/**
 * @typedef {import('@elastic/elasticsearch').Client} elastic.Client
 * @typedef {import('mongodb').Db} mongodb.Db
 * @typedef {import('@idio/github').GithubUser} _idio.GithubUser
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 * @typedef {Object} LinkedInUser `＠record`
 * @prop {string} id The user ID.
 * @prop {string} firstName The user's first name.
 * @prop {string} lastName The user's last name.
 * @prop {string} profilePicture The URL to the profile picture.
 * @typedef {Object} Auth `＠record`
 * @prop {LinkedInUser} [linkedin_user] User Info.
 * @prop {_idio.GithubUser} [github_user] GitHub User.
 * @prop {string} [csrf] The CSRF token.
 * @typedef {Object} WebsiteComment
 * @prop {string} [_id] id.
 * @prop {boolean} [isAuthor] Whether the current session user wrote this comment.
 * @prop {string} [country] The country name.
 * @prop {string} [name] The display name.
 * @prop {string} [photo] The photo to show.
 * @prop {string} comment The text of the comment.
 * @prop {Date} date When the comment was added.
 * @prop {_idio.GithubUser} github_user GitHub user, if logged in.
 * @prop {LinkedInUser} linkedin_user Linkedin user, if logged in.
 */
