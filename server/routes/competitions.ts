import assert = require('assert');
import SqlString = require('sqlstring');

import { Router } from 'express';
import { BaseRoute } from './baseRoute';
import { CompetitionControl } from '../controllers/competitions';

export class CompetitionRoutes implements BaseRoute {
	public static createRouter = (): Router => {
		const CompCtrl = new CompetitionControl();
		const router: Router = Router();
		
		router
      .post('/', CompCtrl.upstartHandler)

      .post('/stock', CompCtrl.stockTheStockHandler)

      .post('/decrypt', CompCtrl.decryptHandler)

      .post('/pitch', CompCtrl.pitchHandler)

      .post('/bizquiz', CompCtrl.bizquizHandler)

		return router;
	}
	public title = 'competitions';
}
