/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Duration } from "../../../../google/protobuf/duration";
import { Coin } from "../../../../cosmos/base/v1beta1/coin";
import { Timestamp } from "../../../../google/protobuf/timestamp";

export const protobufPackage = "osmosis.gamm.v1beta1";

/**
 * Parameters for changing the weights in a balancer pool smoothly from
 * a start weight and end weight over a period of time.
 * Currently, the only smooth change supported is linear changing between
 * the two weights, but more types may be added in the future.
 * When these parameters are set, the weight w(t) for pool time `t` is the
 * following:
 *   t <= start_time: w(t) = initial_pool_weights
 *   start_time < t <= start_time + duration:
 *     w(t) = initial_pool_weights + (t - start_time) *
 *       (target_pool_weights - initial_pool_weights) / (duration)
 *   t > start_time + duration: w(t) = target_pool_weights
 */
export interface SmoothWeightChangeParams {
  /**
   * The start time for beginning the weight change.
   * If a parameter change / pool instantiation leaves this blank,
   * it should be generated by the state_machine as the current time.
   */
  startTime: Date;
  /** Duration for the weights to change over */
  duration: Duration;
  /**
   * The initial pool weights. These are copied from the pool's settings
   * at the time of weight change instantiation.
   * The amount PoolAsset.token.amount field is ignored if present,
   * future type refactorings should just have a type with the denom & weight
   * here.
   */
  initialPoolWeights: PoolAsset[];
  /**
   * The target pool weights. The pool weights will change linearly with respect
   * to time between start_time, and start_time + duration. The amount
   * PoolAsset.token.amount field is ignored if present, future type
   * refactorings should just have a type with the denom & weight here.
   */
  targetPoolWeights: PoolAsset[];
}

/**
 * PoolParams defined the parameters that will be managed by the pool
 * governance in the future. This params are not managed by the chain
 * governance. Instead they will be managed by the token holders of the pool.
 * The pool's token holders are specified in future_pool_governor.
 */
export interface PoolParams {
  swapFee: string;
  exitFee: string;
  smoothWeightChangeParams: SmoothWeightChangeParams;
}

/**
 * Pool asset is an internal struct that combines the amount of the
 * token in the pool, and its balancer weight.
 * This is an awkward packaging of data,
 * and should be revisited in a future state migration.
 */
export interface PoolAsset {
  /**
   * Coins we are talking about,
   * the denomination must be unique amongst all PoolAssets for this pool.
   */
  token: Coin;
  /** Weight that is not normalized. This weight must be less than 2^50 */
  weight: string;
}

export interface Pool {
  address: string;
  id: Long;
  poolParams: PoolParams;
  /**
   * This string specifies who will govern the pool in the future.
   * Valid forms of this are:
   * {token name},{duration}
   * {duration}
   * where {token name} if specified is the token which determines the
   * governor, and if not specified is the LP token for this pool.duration is
   * a time specified as 0w,1w,2w, etc. which specifies how long the token
   * would need to be locked up to count in governance. 0w means no lockup.
   * TODO: Further improve these docs
   */
  futurePoolGovernor: string;
  /** sum of all LP tokens sent out */
  totalShares: Coin;
  /**
   * These are assumed to be sorted by denomiation.
   * They contain the pool asset and the information about the weight
   */
  poolAssets: PoolAsset[];
  /** sum of all non-normalized pool weights */
  totalWeight: string;
}

function createBaseSmoothWeightChangeParams(): SmoothWeightChangeParams {
  return {
    startTime: undefined,
    duration: undefined,
    initialPoolWeights: [],
    targetPoolWeights: [],
  };
}

export const SmoothWeightChangeParams = {
  encode(
    message: SmoothWeightChangeParams,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.startTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.startTime),
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.duration !== undefined) {
      Duration.encode(message.duration, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.initialPoolWeights) {
      PoolAsset.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.targetPoolWeights) {
      PoolAsset.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SmoothWeightChangeParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSmoothWeightChangeParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.startTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.duration = Duration.decode(reader, reader.uint32());
          break;
        case 3:
          message.initialPoolWeights.push(
            PoolAsset.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.targetPoolWeights.push(
            PoolAsset.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SmoothWeightChangeParams {
    return {
      startTime: isSet(object.startTime)
        ? fromJsonTimestamp(object.startTime)
        : undefined,
      duration: isSet(object.duration)
        ? Duration.fromJSON(object.duration)
        : undefined,
      initialPoolWeights: Array.isArray(object?.initialPoolWeights)
        ? object.initialPoolWeights.map((e: any) => PoolAsset.fromJSON(e))
        : [],
      targetPoolWeights: Array.isArray(object?.targetPoolWeights)
        ? object.targetPoolWeights.map((e: any) => PoolAsset.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SmoothWeightChangeParams): unknown {
    const obj: any = {};
    message.startTime !== undefined &&
      (obj.startTime = message.startTime.toISOString());
    message.duration !== undefined &&
      (obj.duration = message.duration
        ? Duration.toJSON(message.duration)
        : undefined);
    if (message.initialPoolWeights) {
      obj.initialPoolWeights = message.initialPoolWeights.map((e) =>
        e ? PoolAsset.toJSON(e) : undefined
      );
    } else {
      obj.initialPoolWeights = [];
    }
    if (message.targetPoolWeights) {
      obj.targetPoolWeights = message.targetPoolWeights.map((e) =>
        e ? PoolAsset.toJSON(e) : undefined
      );
    } else {
      obj.targetPoolWeights = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SmoothWeightChangeParams>, I>>(
    object: I
  ): SmoothWeightChangeParams {
    const message = createBaseSmoothWeightChangeParams();
    message.startTime = object.startTime ?? undefined;
    message.duration =
      object.duration !== undefined && object.duration !== null
        ? Duration.fromPartial(object.duration)
        : undefined;
    message.initialPoolWeights =
      object.initialPoolWeights?.map((e) => PoolAsset.fromPartial(e)) || [];
    message.targetPoolWeights =
      object.targetPoolWeights?.map((e) => PoolAsset.fromPartial(e)) || [];
    return message;
  },
};

function createBasePoolParams(): PoolParams {
  return { swapFee: "", exitFee: "", smoothWeightChangeParams: undefined };
}

export const PoolParams = {
  encode(
    message: PoolParams,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.swapFee !== "") {
      writer.uint32(10).string(message.swapFee);
    }
    if (message.exitFee !== "") {
      writer.uint32(18).string(message.exitFee);
    }
    if (message.smoothWeightChangeParams !== undefined) {
      SmoothWeightChangeParams.encode(
        message.smoothWeightChangeParams,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PoolParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoolParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.swapFee = reader.string();
          break;
        case 2:
          message.exitFee = reader.string();
          break;
        case 3:
          message.smoothWeightChangeParams = SmoothWeightChangeParams.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PoolParams {
    return {
      swapFee: isSet(object.swapFee) ? String(object.swapFee) : "",
      exitFee: isSet(object.exitFee) ? String(object.exitFee) : "",
      smoothWeightChangeParams: isSet(object.smoothWeightChangeParams)
        ? SmoothWeightChangeParams.fromJSON(object.smoothWeightChangeParams)
        : undefined,
    };
  },

  toJSON(message: PoolParams): unknown {
    const obj: any = {};
    message.swapFee !== undefined && (obj.swapFee = message.swapFee);
    message.exitFee !== undefined && (obj.exitFee = message.exitFee);
    message.smoothWeightChangeParams !== undefined &&
      (obj.smoothWeightChangeParams = message.smoothWeightChangeParams
        ? SmoothWeightChangeParams.toJSON(message.smoothWeightChangeParams)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PoolParams>, I>>(
    object: I
  ): PoolParams {
    const message = createBasePoolParams();
    message.swapFee = object.swapFee ?? "";
    message.exitFee = object.exitFee ?? "";
    message.smoothWeightChangeParams =
      object.smoothWeightChangeParams !== undefined &&
      object.smoothWeightChangeParams !== null
        ? SmoothWeightChangeParams.fromPartial(object.smoothWeightChangeParams)
        : undefined;
    return message;
  },
};

function createBasePoolAsset(): PoolAsset {
  return { token: undefined, weight: "" };
}

export const PoolAsset = {
  encode(
    message: PoolAsset,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.token !== undefined) {
      Coin.encode(message.token, writer.uint32(10).fork()).ldelim();
    }
    if (message.weight !== "") {
      writer.uint32(18).string(message.weight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PoolAsset {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoolAsset();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.token = Coin.decode(reader, reader.uint32());
          break;
        case 2:
          message.weight = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PoolAsset {
    return {
      token: isSet(object.token) ? Coin.fromJSON(object.token) : undefined,
      weight: isSet(object.weight) ? String(object.weight) : "",
    };
  },

  toJSON(message: PoolAsset): unknown {
    const obj: any = {};
    message.token !== undefined &&
      (obj.token = message.token ? Coin.toJSON(message.token) : undefined);
    message.weight !== undefined && (obj.weight = message.weight);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PoolAsset>, I>>(
    object: I
  ): PoolAsset {
    const message = createBasePoolAsset();
    message.token =
      object.token !== undefined && object.token !== null
        ? Coin.fromPartial(object.token)
        : undefined;
    message.weight = object.weight ?? "";
    return message;
  },
};

function createBasePool(): Pool {
  return {
    address: "",
    id: Long.UZERO,
    poolParams: undefined,
    futurePoolGovernor: "",
    totalShares: undefined,
    poolAssets: [],
    totalWeight: "",
  };
}

export const Pool = {
  encode(message: Pool, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (!message.id.isZero()) {
      writer.uint32(16).uint64(message.id);
    }
    if (message.poolParams !== undefined) {
      PoolParams.encode(message.poolParams, writer.uint32(26).fork()).ldelim();
    }
    if (message.futurePoolGovernor !== "") {
      writer.uint32(34).string(message.futurePoolGovernor);
    }
    if (message.totalShares !== undefined) {
      Coin.encode(message.totalShares, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.poolAssets) {
      PoolAsset.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.totalWeight !== "") {
      writer.uint32(58).string(message.totalWeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Pool {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePool();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.id = reader.uint64() as Long;
          break;
        case 3:
          message.poolParams = PoolParams.decode(reader, reader.uint32());
          break;
        case 4:
          message.futurePoolGovernor = reader.string();
          break;
        case 5:
          message.totalShares = Coin.decode(reader, reader.uint32());
          break;
        case 6:
          message.poolAssets.push(PoolAsset.decode(reader, reader.uint32()));
          break;
        case 7:
          message.totalWeight = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Pool {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      id: isSet(object.id) ? Long.fromString(object.id) : Long.UZERO,
      poolParams: isSet(object.poolParams)
        ? PoolParams.fromJSON(object.poolParams)
        : undefined,
      futurePoolGovernor: isSet(object.futurePoolGovernor)
        ? String(object.futurePoolGovernor)
        : "",
      totalShares: isSet(object.totalShares)
        ? Coin.fromJSON(object.totalShares)
        : undefined,
      poolAssets: Array.isArray(object?.poolAssets)
        ? object.poolAssets.map((e: any) => PoolAsset.fromJSON(e))
        : [],
      totalWeight: isSet(object.totalWeight) ? String(object.totalWeight) : "",
    };
  },

  toJSON(message: Pool): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.id !== undefined &&
      (obj.id = (message.id || Long.UZERO).toString());
    message.poolParams !== undefined &&
      (obj.poolParams = message.poolParams
        ? PoolParams.toJSON(message.poolParams)
        : undefined);
    message.futurePoolGovernor !== undefined &&
      (obj.futurePoolGovernor = message.futurePoolGovernor);
    message.totalShares !== undefined &&
      (obj.totalShares = message.totalShares
        ? Coin.toJSON(message.totalShares)
        : undefined);
    if (message.poolAssets) {
      obj.poolAssets = message.poolAssets.map((e) =>
        e ? PoolAsset.toJSON(e) : undefined
      );
    } else {
      obj.poolAssets = [];
    }
    message.totalWeight !== undefined &&
      (obj.totalWeight = message.totalWeight);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Pool>, I>>(object: I): Pool {
    const message = createBasePool();
    message.address = object.address ?? "";
    message.id =
      object.id !== undefined && object.id !== null
        ? Long.fromValue(object.id)
        : Long.UZERO;
    message.poolParams =
      object.poolParams !== undefined && object.poolParams !== null
        ? PoolParams.fromPartial(object.poolParams)
        : undefined;
    message.futurePoolGovernor = object.futurePoolGovernor ?? "";
    message.totalShares =
      object.totalShares !== undefined && object.totalShares !== null
        ? Coin.fromPartial(object.totalShares)
        : undefined;
    message.poolAssets =
      object.poolAssets?.map((e) => PoolAsset.fromPartial(e)) || [];
    message.totalWeight = object.totalWeight ?? "";
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function toTimestamp(date: Date): Timestamp {
  const seconds = numberToLong(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds.toNumber() * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function numberToLong(number: number) {
  return Long.fromNumber(number);
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
