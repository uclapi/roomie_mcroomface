ROOT_URL = 'https://enghub.io/api/v1/'
SHIB_URL = 'https://enghub.io/Shibboleth.sso/'

STREAM_PUBLISH_URL      = ROOT_URL + 'push.publish'
STREAM_SUBSCRIBE_URL    = ROOT_URL + 'push.subscribe/'
STREAM_SUBSCRIBE_LP_URL = ROOT_URL + 'push.subscribe_longpoll/'

CLOSING_TIME = {"weekend": datetime.time(18, 0), "week": datetime.time(21, 0)}
OPENING_TIME = {"weekend": datetime.time(9, 0), "week": datetime.time(8, 0)}
