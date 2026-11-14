
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.20.0
 * Query Engine version: 06fc58a368dc7be9fbbbe894adf8d445d208c284
 */
Prisma.prismaVersion = {
  client: "5.20.0",
  engine: "06fc58a368dc7be9fbbbe894adf8d445d208c284"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ContactMessageScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  message: 'message',
  createdAt: 'createdAt'
};

exports.Prisma.InviteResponseScalarFieldEnum = {
  id: 'id',
  senderName: 'senderName',
  friendName: 'friendName',
  plan: 'plan',
  ipHash: 'ipHash',
  acceptedAt: 'acceptedAt'
};

exports.Prisma.SubscriberScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.ExperienceScalarFieldEnum = {
  id: 'id',
  company: 'company',
  role: 'role',
  startDate: 'startDate',
  endDate: 'endDate',
  description: 'description',
  order: 'order',
  createdAt: 'createdAt'
};

exports.Prisma.EducationScalarFieldEnum = {
  id: 'id',
  school: 'school',
  degree: 'degree',
  startDate: 'startDate',
  endDate: 'endDate',
  description: 'description',
  order: 'order',
  createdAt: 'createdAt'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  title: 'title',
  category: 'category',
  description: 'description',
  tags: 'tags',
  link: 'link',
  github: 'github',
  featured: 'featured',
  order: 'order',
  createdAt: 'createdAt'
};

exports.Prisma.CertificateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  issuer: 'issuer',
  date: 'date',
  url: 'url',
  order: 'order',
  createdAt: 'createdAt'
};

exports.Prisma.SkillScalarFieldEnum = {
  id: 'id',
  category: 'category',
  name: 'name',
  order: 'order',
  createdAt: 'createdAt'
};

exports.Prisma.EmailTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  subject: 'subject',
  html: 'html',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuestionScalarFieldEnum = {
  id: 'id',
  normalized: 'normalized',
  original: 'original',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnswerScalarFieldEnum = {
  id: 'id',
  questionId: 'questionId',
  content: 'content',
  usageCount: 'usageCount',
  createdAt: 'createdAt'
};

exports.Prisma.SiteSettingsScalarFieldEnum = {
  id: 'id',
  fullName: 'fullName',
  headline: 'headline',
  phone: 'phone',
  location: 'location',
  websiteUrl: 'websiteUrl',
  summary: 'summary',
  contactEmail: 'contactEmail',
  senderEmail: 'senderEmail',
  githubUrl: 'githubUrl',
  linkedinUrl: 'linkedinUrl',
  instagramUrl: 'instagramUrl',
  upworkUrl: 'upworkUrl',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailCampaignScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  status: 'status',
  batchSize: 'batchSize',
  intervalMinutes: 'intervalMinutes',
  nextRunAt: 'nextRunAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailDeliveryScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  subscriberId: 'subscriberId',
  templateId: 'templateId',
  status: 'status',
  error: 'error',
  sentAt: 'sentAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  requesterName: 'requesterName',
  requesterEmail: 'requesterEmail',
  requesterPhone: 'requesterPhone',
  requesterCompany: 'requesterCompany',
  requesterTimezone: 'requesterTimezone',
  topic: 'topic',
  notes: 'notes',
  durationMinutes: 'durationMinutes',
  proposedAt: 'proposedAt',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  status: 'status',
  platform: 'platform',
  meetingUrl: 'meetingUrl',
  meetingId: 'meetingId',
  hostUrl: 'hostUrl',
  meetingPassword: 'meetingPassword',
  calendarEventId: 'calendarEventId',
  calendarHtmlLink: 'calendarHtmlLink',
  failureReason: 'failureReason',
  decidedAt: 'decidedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppSettingScalarFieldEnum = {
  key: 'key',
  value: 'value',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  ContactMessage: 'ContactMessage',
  InviteResponse: 'InviteResponse',
  Subscriber: 'Subscriber',
  Experience: 'Experience',
  Education: 'Education',
  Project: 'Project',
  Certificate: 'Certificate',
  Skill: 'Skill',
  EmailTemplate: 'EmailTemplate',
  Question: 'Question',
  Answer: 'Answer',
  SiteSettings: 'SiteSettings',
  EmailCampaign: 'EmailCampaign',
  EmailDelivery: 'EmailDelivery',
  Booking: 'Booking',
  AppSetting: 'AppSetting'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
