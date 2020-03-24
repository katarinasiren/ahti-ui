import React, { useState, useRef } from 'react';
import MapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
  StaticMap,
  FlyToInterpolator,
  TransitionInterpolator,
  EasingFunction,
  TRANSITION_EVENTS
} from 'react-map-gl';
import { BBox } from 'geojson';
import useSupercluster from 'use-supercluster';
import { useTranslation } from 'react-i18next';
import { PointFeature } from 'supercluster';

import { Feature } from '../../../domain/api/generated/types.d';
import {
  initialLatitude,
  initialLongitude,
  initialZoomLevel,
  maxZoomLevel,
  minZoomLevel,
  clusteringRadius,
  selectedFeatureZoomLevel,
  transitionDuration
} from '../../constants';
import CategoryIcon from '../CategoryIcon/CategoryIcon';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './Map.module.scss';
import { getMapStyle, getFlyToPoint, getPoints, getRoutes } from './mapUtils';

/*
// Approach for clustering used from here
// https://www.leighhalliday.com/mapbox-clustering
*/
interface MapProps {
  readonly className?: string;
  readonly features: Feature[];
  readonly selectedFeature?: Feature | null;
  onClick(feature: Feature): void;
}
type GeoJsonProperties = { cluster: boolean; itemId: string; category: string };
type ClusterProperties = GeoJsonProperties & { point_count: number };

type ViewportState = {
  width?: string | number;
  height?: string | number;
  latitude: number;
  longitude: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  transitionInterpolator?: TransitionInterpolator;
  transitionDuration?: number | 'auto';
  transitionInterruption?: TRANSITION_EVENTS;
  transitionEasing?: EasingFunction;
  bearing?: number;
  pitch?: number;
  altitude?: number;
  maxPitch?: number;
  minPitch?: number;
};

const Map: React.FC<MapProps> = ({
  className,
  features,
  selectedFeature,
  onClick
}) => {
  const points = getPoints(features);
  const routes = getRoutes(features, selectedFeature);
  const flyToPoint = getFlyToPoint(selectedFeature);

  const { t } = useTranslation();
  const [viewPort, setViewPort] = useState<ViewportState>({
    width: '100%',
    height: '100%',
    longitude: flyToPoint ? flyToPoint.longitude : initialLongitude,
    latitude: flyToPoint ? flyToPoint.latitude : initialLatitude,
    zoom: selectedFeature ? selectedFeatureZoomLevel : initialZoomLevel,
    minZoom: minZoomLevel,
    maxZoom: maxZoomLevel
  });

  const mapRef = useRef<StaticMap>();
  const renderPin = (
    pointFeature: PointFeature<GeoJsonProperties>,
    id: number | string
  ) => {
    if (pointFeature.geometry.type !== 'Point') {
      return null;
    }

    const isSelected =
      pointFeature?.properties?.itemId === selectedFeature?.properties?.ahtiId;
    const onMarkerClick = () => {
      onClick(feature);
      window && window.scrollTo({ top: 0 });
      setViewPort({
        ...viewPort,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom:
          viewPort.zoom > selectedFeatureZoomLevel
            ? viewPort.zoom
            : selectedFeatureZoomLevel,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: transitionDuration
      });
    };
    const feature = features.find(feature => feature.id === pointFeature.id);
    return (
      <Marker
        key={`pin-${id}`}
        longitude={pointFeature.geometry.coordinates[0]}
        latitude={pointFeature.geometry.coordinates[1]}
      >
        <div onClick={onMarkerClick} className={styles.markerContent}>
          <CategoryIcon
            category={feature?.properties?.category?.id}
            className={isSelected ? styles.bigIcon : undefined}
          />
        </div>
      </Marker>
    );
  };

  const getBounds: () => BBox | null = function() {
    const current = mapRef?.current;
    if (!current) return null;
    return current
      .getMap()
      .getBounds()
      .toArray()
      .flat() as BBox;
  };
  const bounds = getBounds();
  const { clusters } = useSupercluster<GeoJsonProperties, ClusterProperties>({
    points,
    bounds,
    zoom: viewPort.zoom,
    options: { radius: clusteringRadius, maxZoom: viewPort.maxZoom }
  });

  return (
    <MapGL
      {...viewPort}
      mapStyle={getMapStyle(routes)}
      width={'100%'}
      height={'100%'}
      className={className}
      ref={mapRef}
      onViewportChange={setViewPort}
      clickRadius={10}
      onNativeClick={event => {
        const clickedRoute =
          event.features &&
          event.features.find(feature => 'route-line' === feature.layer.id);

        if (!clickedRoute) {
          return;
        }

        const clickedFeature = features.find(
          feature =>
            feature.properties.ahtiId === clickedRoute.properties.ahtiId
        );

        if (clickedFeature) {
          onClick(clickedFeature);
        }
      }}
    >
      <div className={styles.mapControls}>
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          label={t('map.geolocate')}
        />
        <div className={styles.mapControlsDivider}></div>
        <NavigationControl
          zoomInLabel={t('map.zoom_in')}
          zoomOutLabel={t('map.zoom_out')}
          showCompass={false}
        />
      </div>
      {clusters.map((cluster: any) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster } = cluster.properties;
        // this is temporary, new designs should come soon
        if (isCluster) {
          const {
            point_count: pointCount
          } = cluster.properties as ClusterProperties;
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              latitude={latitude}
              longitude={longitude}
            >
              <div
                className={styles.clusterMarker}
                style={{
                  width: `${10 + (pointCount / points.length) * 20}px`,
                  height: `${10 + (pointCount / points.length) * 20}px`
                }}
              >
                {pointCount}
              </div>
            </Marker>
          );
        } else {
          return renderPin(
            cluster as PointFeature<GeoJsonProperties>,
            cluster.id
          );
        }
      })}
    </MapGL>
  );
};
export default Map;
