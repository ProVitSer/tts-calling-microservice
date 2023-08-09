import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import Ari, { Channel } from 'ari-client';
import { AsteriskAriOriginate } from './interfaces/asterisk.interface';

@Injectable()
export class AsteriskAriACallService implements OnApplicationBootstrap {
  private client: { ariClient: Ari.Client };
  constructor(@Inject('ARI') private readonly ari: { ariClient: Ari.Client }) {}

  public async onApplicationBootstrap() {
    this.client = this.ari;
  }

  public async sendAriCall(originateInfo: AsteriskAriOriginate) {
    try {
      return await this._sendAriCall(originateInfo);
    } catch (e) {
      throw e;
    }
  }

  private async _sendAriCall(originateInfo: AsteriskAriOriginate): Promise<Channel> {
    const channel = this.getAriChannel();
    return await channel.originate({
      ...originateInfo,
    });
  }

  private getAriChannel(): Ari.Channel {
    return this.client.ariClient.Channel();
  }
}
