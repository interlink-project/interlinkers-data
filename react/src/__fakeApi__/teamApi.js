import { addDays, subDays, subHours, subMinutes } from 'date-fns';
import axiosInstance from '../axios';
const now = new Date();

class TeamApi {
  async getTeams() {
    const interlinkers = [
      {
        id: '5e8dcef8f95685ce21f16f3d',
        image:
          'https://simpatico.hi-iberia.es:4570/servicepedia/assets/logo_simpatico_small.png',
        team: {
          id: '5e887b7602bdbc4dbb234b27',
          name: 'Interlink Core Team Zaragoza',
          membersCount: 2,
        },
        description: `Citizenpedia is a Human-Computation enabling component which complements -government environments with a collaborative space
        where citizens and civil servants share and exploit accessible knowledge
        about public procedures, and more specifically, where citizens can solve
        their doubts and actively take part in the enhancement of e-services. To
        that end, Citizenpedia has been designed, as a participation (one of the key
        pillars of Open Government) fostering component comprised of three
        complementary tools, namely Question & Answer Engine (QAE), Collaborative Procedure Designer (CPD) and Servicepedia.`,
        currency: '$',
        isLiked: true,
        likes: 7,
        location: 'Spain',
        rating: 4,

        status: 'Engagement',
        title: 'Servicepedia',
        type: 'Example',
        updatedAt: subMinutes(now, 24).getTime(),
      },
      {
        id: '5e8dcef8f95685ce21f16f3F',
        title: 'OpenID',
        image:
          'https://img2.freepng.es/20180401/sdq/kisspng-openid-connect-authentication-oauth-identity-provi-id-5ac09ae9d954c2.0870859515225720098902.jpg',
        team: {
          id: '5e887b7602bdbc4dbb234b27',
          name: 'Example team',
          membersCount: 6,
        },
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum nisl est, non feugiat nulla vehicula et. Proin non justo justo. Sed rhoncus tempus posuere. In hac habitasse platea dictumst. Vivamus eu urna sed metus euismod varius vitae sed diam. Integer pharetra, odio vitae dignissim eleifend, est mauris molestie diam, eget fermentum lacus nulla eu metus. In risus libero, commodo vel feugiat sit amet, pretium sit amet velit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris consectetur aliquet ligula, id placerat lorem auctor ut. Suspendisse cursus in mauris eu varius. Fusce quis justo tincidunt, tempus diam non, vestibulum eros. Quisque volutpat, augue id pretium lobortis, tortor nisl ornare metus, at molestie elit diam vel arcu. Praesent aliquet posuere sapien, in facilisis orci accumsan quis. Mauris et lobortis elit. Proin tincidunt sed nunc at malesuada. Phasellus gravida mauris nec bibendum elementum. Fusce condimentum et magna eu ornare. Vestibulum porttitor, enim a tristique rutrum, odio arcu rutrum mi, et tempor tellus ipsum vel nibh. Ut faucibus vel diam nec faucibus. Pellentesque dictum orci risus, id pulvinar augue ultricies quis. Sed convallis fermentum lectus, ac consectetur sem consequat sit amet. Nunc vitae odio sed turpis rhoncus ornare.`,
        currency: '$',
        isLiked: true,
        likes: 7,
        location: 'Spain',
        rating: 4,

        status: 'Engagement',
        type: 'Example',
        updatedAt: subMinutes(now, 2404).getTime(),
      },
    ];

    return Promise.resolve(interlinkers);
    const res = await axiosInstance.get('/teams');
    console.log("getTeams call", res.data)
    return res.data
  }

  getTeam(id) {
    return axiosInstance.get(`/teams/${id}`).then((res) => res)
  }
}

export const teamApi = new TeamApi();
