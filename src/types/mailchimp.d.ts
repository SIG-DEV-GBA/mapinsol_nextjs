declare module '@mailchimp/mailchimp_marketing' {
  interface Config {
    apiKey: string;
    server: string;
  }

  interface ListMemberBody {
    email_address: string;
    status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'transactional';
    merge_fields?: Record<string, string>;
  }

  interface ListMemberUpdateBody {
    status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'transactional';
    merge_fields?: Record<string, string>;
  }

  interface Lists {
    addListMember(listId: string, body: ListMemberBody): Promise<unknown>;
    updateListMember(listId: string, subscriberHash: string, body: ListMemberUpdateBody): Promise<unknown>;
  }

  interface Mailchimp {
    setConfig(config: Config): void;
    lists: Lists;
  }

  const mailchimp: Mailchimp;
  export default mailchimp;
}
